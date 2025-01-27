import { promises as fs } from 'fs';
import * as path from 'node:path';
import { Plugin, normalizePath } from 'vite';

interface SvelteEverywhereOptions {
    componentsDir?: string;
    outputDir?: string;
    defaultMode?: 'eager' | 'lazy';
    defaultShadowMode?: 'open' | 'closed' | 'none'; // New option for default shadow mode
    templatesDir?: string;
    cleanOutputDir?: boolean;
    log?: boolean;
}

export default function svelteEverywhere(options: SvelteEverywhereOptions = {}): Plugin {
    const {
        componentsDir = 'src',
        outputDir = 'src/generated/custom-component',
        defaultMode = 'lazy',
        defaultShadowMode = 'none', // Default to 'none'
        templatesDir,
        cleanOutputDir = true,
        log = false,
    } = options;

    // Validate the default shadow mode
    validateShadowMode(defaultShadowMode);

    const collectedComponents = new Map<
        string,
        { tag: string; mode: 'eager' | 'lazy'; shadow: string }
    >(); // Maps file path -> component details
    const generatedFiles = new Map<string, string>(); // Maps file path -> generated file path
    const registeredTags = new Map<string, string>(); // Maps tag -> file path
    let eagerTemplate: string;
    let lazyTemplate: string;
    const outputPath = path.resolve(outputDir);

    const logInfo = (message: string) => log && console.log(`[svelte-everywhere] ${message}`);
    const logError = (message: string) => log && console.error(`[svelte-everywhere] ERROR: ${message}`);

    // Validate shadow mode
    function validateShadowMode(shadow: string): void {
        const validShadowModes = ['open', 'closed', 'none'];
        if (!validShadowModes.includes(shadow)) {
            throw new Error(
                `Invalid shadow mode "${shadow}". Allowed values are: "open", "closed", "none".`
            );
        }
    }

    // Validate custom element tag name
    function validateTagName(tag: string): void {
        const isValid = /^[a-z][a-z0-9\-]*\-[a-z0-9\-]+$/.test(tag);
        if (!isValid) {
            throw new Error(
                `Invalid custom element tag name "${tag}". Tag names must be lowercase and contain at least one hyphen.`
            );
        }
    }

    // Load templates from the user or fallback to defaults
    async function loadTemplates() {
        const defaultTemplatesDir = path.resolve(__dirname, './templates');
        const userTemplatesDir = templatesDir ? path.resolve(process.cwd(), templatesDir) : null;

        const eagerPath = userTemplatesDir
            ? path.resolve(userTemplatesDir, 'eager-template.svelte')
            : path.resolve(defaultTemplatesDir, 'eager-template.svelte');

        const lazyPath = userTemplatesDir
            ? path.resolve(userTemplatesDir, 'lazy-template.svelte')
            : path.resolve(defaultTemplatesDir, 'lazy-template.svelte');

        eagerTemplate = await loadFileOrFallback(eagerPath, path.resolve(defaultTemplatesDir, 'eager-template.svelte'));
        lazyTemplate = await loadFileOrFallback(lazyPath, path.resolve(defaultTemplatesDir, 'lazy-template.svelte'));
    }

    async function loadFileOrFallback(filePath: string, fallbackPath: string): Promise<string> {
        try {
            return await fs.readFile(filePath, 'utf-8');
        } catch {
            logInfo(`Using fallback template for: ${filePath}`);
            return await fs.readFile(fallbackPath, 'utf-8');
        }
    }

    // Recursively collect all .svelte files in a directory
    async function collectSvelteFiles(dir: string): Promise<string[]> {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(
            entries.map((entry) => {
                const fullPath = path.resolve(dir, entry.name);
                return entry.isDirectory() ? collectSvelteFiles(fullPath) : fullPath;
            })
        );
        return files.flat().filter((file) => file.endsWith('.svelte'));
    }

    // Parse a Svelte file for @custom-element annotations
    async function parseSvelteFile(file: string) {
        const content = await fs.readFile(file, 'utf-8');
        const match = content.match(/@custom-element\s+(\S+)(?:\s+shadow=(\S+))?(?:\s+(eager|lazy))?/);
        const normalizedPath = normalizePath(file);

        const previousComponent = collectedComponents.get(normalizedPath);

        // If a previous tag existed, remove it from registered tags
        if (previousComponent) {
            const { tag: oldTag } = previousComponent;
            if (registeredTags.has(oldTag) && registeredTags.get(oldTag) === normalizedPath) {
                registeredTags.delete(oldTag);
                await removeGeneratedFile(normalizedPath); // Remove the old generated file
            }
        }

        if (match) {
            const [_, tag, shadow = defaultShadowMode, mode = defaultMode] = match;

            // Validate the tag name
            validateTagName(tag);

            // Validate shadow mode
            validateShadowMode(shadow);

            // Check for tag collisions
            if (registeredTags.has(tag) && registeredTags.get(tag) !== normalizedPath) {
                logError(`Tag "${tag}" is already defined in ${registeredTags.get(tag)}.`);
                throw new Error(`Custom element tag collision: "${tag}"`);
            }

            // Add the new tag to the registry and collected components
            registeredTags.set(tag, normalizedPath);
            collectedComponents.set(normalizedPath, {
                tag,
                mode: mode.trim() as 'eager' | 'lazy',
                shadow: shadow.trim(),
            });
            logInfo(`Parsed component: ${tag} from ${file}`);
        } else {
            // If the file no longer defines a custom element, remove it
            collectedComponents.delete(normalizedPath);
        }
    }

    // Generate a file for the custom element
    async function generateFile(file: string) {
        const component = collectedComponents.get(normalizePath(file));
        if (!component) return;

        const { tag, mode, shadow } = component;
        const template = mode === 'eager' ? eagerTemplate : lazyTemplate;

        const relativePath = normalizePath(path.relative(outputPath, file));

        const content = template
            .replace(/{{CUSTOM_ELEMENT_TAG}}/g, tag)
            .replace(/{{SVELTE_PATH}}/g, relativePath)
            .replace(/{{SHADOW_MODE}}/g, shadow);

        const outputFile = path.resolve(outputPath, `${tag}.svelte`);
        await fs.mkdir(outputPath, { recursive: true });
        await fs.writeFile(outputFile, content, 'utf-8');
        generatedFiles.set(normalizePath(file), outputFile);
        logInfo(`Generated: ${outputFile}`);
    }

    // Remove a generated file when its source is deleted or modified
    async function removeGeneratedFile(file: string) {
        const normalizedPath = normalizePath(file);
        const outputFile = generatedFiles.get(normalizedPath);
        if (outputFile) {
            const component = collectedComponents.get(normalizedPath);
            if (component) {
                registeredTags.delete(component.tag);
            }
            await fs.rm(outputFile, { force: true });
            generatedFiles.delete(normalizedPath);
            collectedComponents.delete(normalizedPath);
            logInfo(`Removed: ${outputFile}`);
        }
    }

    return {
        name: 'vite-plugin-svelte-everywhere',

        async buildStart() {
            logInfo('Initializing plugin...');
            await loadTemplates();

            if (cleanOutputDir) {
                await fs.rm(outputPath, { recursive: true, force: true });
                logInfo('Cleaned output directory.');
            }

            const files = await collectSvelteFiles(path.resolve(process.cwd(), componentsDir));
            for (const file of files) {
                await parseSvelteFile(file);
                await generateFile(file);
            }
        },

        configureServer(server) {
            server.watcher.on('change', async (file) => {
                if (file.endsWith('.svelte')) {
                    logInfo(`Detected change in: ${file}`);
                    await parseSvelteFile(file);
                    await generateFile(file);
                }
            });

            server.watcher.on('unlink', async (file) => {
                if (file.endsWith('.svelte')) {
                    logInfo(`Detected deletion of: ${file}`);
                    await removeGeneratedFile(file);
                }
            });
        },
    };
}

import { promises as fs } from 'node:fs';
import * as path from 'path';
import { Plugin, normalizePath } from 'vite';
import { fileURLToPath } from 'node:url';

interface SvelteAnywhereOptions {
    componentsDir?: string;
    outputDir?: string;
    defaultTemplate?: string;
    defaultShadowMode?: 'open' | 'none';
    templatesDir?: string;
    cleanOutputDir?: boolean;
    log?: boolean;
}

interface ComponentData {
    tag: string;
    template: string;
    shadow: string;
    generatedPath: string;
}

export default function svelteAnywhere(options: SvelteAnywhereOptions = {}): Plugin {
    const {
        componentsDir = 'src',
        outputDir = 'src/generated/custom-element',
        defaultTemplate = 'lazy',
        defaultShadowMode = 'none',
        templatesDir,
        cleanOutputDir = true,
        log = false,
    } = options;

    const customTemplatesDir = templatesDir ? path.resolve(process.cwd(), templatesDir) : null;
    const defaultTemplatesDir = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        'templates'
    );

    const templateCache = new Map<string, string>();
    const components = new Map<string, ComponentData>();
    const registeredTags = new Map<string, string>();
    const outputPath = path.resolve(outputDir);

    const logInfo = (message: string) => log && console.log(`[svelte-anywhere] ${message}`);
    const logError = (message: string) => log && console.error(`[svelte-anywhere] ERROR: ${message}`);

    function validateShadowMode(shadow: string): void {
        if (!['open', 'none'].includes(shadow)) {
            throw new Error(`Invalid shadow mode "${shadow}". Allowed values: "open", "none".`);
        }
    }

    function validateTagName(tag: string): void {
        if (!/^[a-z][a-z0-9\-]*\-[a-z0-9\-]+$/.test(tag)) {
            throw new Error(`Invalid tag "${tag}". Must be lowercase with hyphen.`);
        }
    }

    async function loadTemplate(name: string): Promise<string> {
        if (templateCache.has(name)) return templateCache.get(name)!;

        const attemptedPaths: string[] = [];
        let content: string | undefined;

        // Try custom templates first
        if (customTemplatesDir) {
            const customPath = path.join(customTemplatesDir, `${name}.template`);
            attemptedPaths.push(customPath);
            try {
                content = await fs.readFile(customPath, 'utf-8');
            } catch {
                logInfo(`Template "${name}" not found in custom directory, using default...`);
            }
        }

        // Fallback to default templates
        if (!content) {
            const defaultPath = path.join(defaultTemplatesDir, `${name}.template`);
            attemptedPaths.push(defaultPath);
            try {
                content = await fs.readFile(defaultPath, 'utf-8');
            } catch {
                const errorMessage = `Template "${name}" not found in:\n${attemptedPaths.join('\n')}`;
                logError(errorMessage);
                throw new Error(errorMessage);
            }
        }

        templateCache.set(name, content);
        return content;
    }

    async function processComponent(filePath: string): Promise<void> {
        if (!filePath.endsWith('.svelte')) return;

        const content = await fs.readFile(filePath, 'utf-8');
        const match = content.match(/@custom-element\s+(\S+)(?:\s+shadow=(\S+))?(?:\s+template=(\S+))?/);
        const normalizedPath = normalizePath(filePath);

        const existing = components.get(normalizedPath);

        if (match) {
            const [_, tag, shadow = defaultShadowMode, template = defaultTemplate] = match;
            validateTagName(tag);
            validateShadowMode(shadow);

            // Check for tag conflicts first
            if (registeredTags.has(tag) && registeredTags.get(tag) !== normalizedPath) {
                logError(`Tag "${tag}" already registered by ${registeredTags.get(tag)}`);
                throw new Error(`Duplicate custom-element tag: ${tag}`);
            }

            // Check if configuration changed
            const templateChanged = existing?.template !== template;
            const shadowChanged = existing?.shadow !== shadow;
            const tagChanged = existing?.tag !== tag;

            if (existing) {
                if (tagChanged) {
                    await removeGeneratedFile(existing.generatedPath);
                    registeredTags.delete(existing.tag);
                }
            }

            const componentData: ComponentData = {
                tag,
                template: template.trim(),
                shadow: shadow.trim(),
                generatedPath: path.resolve(outputPath, `${tag}.svelte`)
            };

            components.set(normalizedPath, componentData);
            registeredTags.set(tag, normalizedPath);

            if (tagChanged || templateChanged || shadowChanged) {
                await generateComponent(normalizedPath);
            } else {
                logInfo(`Skipping unchanged component: ${tag}`);
            }
        } else if (existing) {
            await removeGeneratedFile(existing.generatedPath);
            components.delete(normalizedPath);
            registeredTags.delete(existing.tag);
        }
    }

    async function generateComponent(filePath: string): Promise<void> {
        const component = components.get(normalizePath(filePath));
        if (!component) return;

        const { tag, template, shadow, generatedPath } = component;
        const templateContent = await loadTemplate(template);
        const relativePath = normalizePath(path.relative(outputPath, filePath));

        const content = templateContent
            .replace(/{{CUSTOM_ELEMENT_TAG}}/g, tag)
            .replace(/{{SVELTE_PATH}}/g, relativePath)
            .replace(/{{SHADOW_MODE}}/g, shadow);

        await fs.mkdir(outputPath, { recursive: true });
        await fs.writeFile(generatedPath, content, 'utf-8');
        logInfo(`Generated: ${generatedPath}`);
    }

    async function removeGeneratedFile(generatedPath: string): Promise<void> {
        try {
            await fs.rm(generatedPath, { force: true });
            logInfo(`Removed: ${generatedPath}`);
        } catch (error) {
            logError(`Failed to remove ${generatedPath}: ${error}`);
        }
    }

    async function collectComponents(dir: string): Promise<void> {
        const entries = await fs.readdir(normalizePath(dir), { withFileTypes: true });
        await Promise.all(entries.map(async (entry) => {
            const fullPath = path.join(dir, entry.name);
            entry.isDirectory() ? await collectComponents(fullPath) : await processComponent(fullPath);
        }));
    }

    return {
        name: 'vite-plugin-svelte-anywhere',

        async buildStart() {
            logInfo('Initializing plugin...');
            await loadTemplate(defaultTemplate);

            if (cleanOutputDir) {
                await fs.rm(outputPath, { recursive: true, force: true });
                logInfo('Cleaned output directory');
            }

            await collectComponents(path.resolve(componentsDir));
        },

        configureServer(server) {
            server.watcher
                .on('change', async (file) => {
                    if (file.endsWith('.svelte')) {
                        logInfo(`Detected change: ${file}`);
                        await processComponent(file);
                    }
                })
                .on('unlink', async (file) => {
                    if (file.endsWith('.svelte')) {
                        logInfo(`Detected removal: ${file}`);
                        const component = components.get(normalizePath(file));
                        if (component) {
                            await removeGeneratedFile(component.generatedPath);
                            components.delete(normalizePath(file));
                            registeredTags.delete(component.tag);
                        }
                    }
                });
        }
    };
}
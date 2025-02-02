type LanguageType = 'en' | 'es';

class NumberTranslator {
    language: LanguageType = $state('en')
    labels = [
        {'en': 'zero', 'es': 'cero'},
        {'en': 'one', 'es': 'uno'},
        {'en': 'two', 'es': 'dos'},
        {'en': 'three', 'es': 'tres'},
        {'en': 'four', 'es': 'cuatro'},
        {'en': 'five', 'es': 'cinco'},
        {'en': 'six', 'es': 'seis'},
        {'en': 'seven', 'es': 'siete'},
        {'en': 'eight', 'es': 'ocho'},
        {'en': 'nine', 'es': 'nueve'},
        {'en': 'ten', 'es': 'diez'}
    ]

    getLanguage() {
        return this.language;
    }

    translate(number: number) {
        return this.labels[number][this.language]
    }

    toggleLanguage() {
        this.language = (this.language == 'en') ? 'es' : 'en';
    }
}

export const numberTranslator = new NumberTranslator();
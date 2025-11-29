import { fetchDefinition } from './api.js';
import { renderResult, renderError, renderHistory, toggleLoading } from './ui.js';
import { storage, getRandomItem } from './utils.js';

const WORDS_OF_DAY = ['serendipity', 'ephemeral', 'eloquent', 'resilience', 'wanderlust', 'luminous', 'ethereal', 'sonder', 'vellichor'];

class DictionaryApp {
    constructor() {
        this.history = storage.get('dictionary_history', []);
        this.theme = storage.get('theme', 'light');
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setWordOfDay();
        this.renderHistoryList();
    }

    setupTheme() {
        if (this.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        storage.set('theme', this.theme);
        this.setupTheme();
    }

    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        searchBtn.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Theme
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // History
        const historyModal = document.getElementById('history-modal');
        document.getElementById('history-toggle').addEventListener('click', () => {
            historyModal.classList.remove('hidden');
            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => {
                historyModal.classList.remove('opacity-0');
                historyModal.querySelector('div').classList.remove('scale-95');
            }, 10);
        });

        const closeHistory = () => {
            historyModal.classList.add('opacity-0');
            historyModal.querySelector('div').classList.add('scale-95');
            setTimeout(() => historyModal.classList.add('hidden'), 300);
        };

        document.getElementById('close-history').addEventListener('click', closeHistory);
        historyModal.addEventListener('click', (e) => {
            if (e.target === historyModal) closeHistory();
        });

        document.getElementById('clear-history').addEventListener('click', () => {
            this.history = [];
            storage.remove('dictionary_history');
            this.renderHistoryList();
        });

        // Delegate clicks for dynamic elements
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('synonym-btn')) {
                const word = e.target.dataset.word;
                this.search(word);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (e.target.closest('.history-item')) {
                const word = e.target.closest('.history-item').dataset.word;
                this.search(word);
                closeHistory();
            }
        });

        // Word of Day
        document.getElementById('wotd-container').addEventListener('click', () => {
            const word = document.getElementById('wotd-word').textContent;
            this.search(word);
        });

        // Voice Input
        const voiceBtn = document.getElementById('voice-btn');
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                voiceBtn.classList.add('text-red-500', 'animate-pulse');
            };

            recognition.onend = () => {
                voiceBtn.classList.remove('text-red-500', 'animate-pulse');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                searchInput.value = transcript;
                this.handleSearch();
            };

            voiceBtn.addEventListener('click', () => recognition.start());
        } else {
            voiceBtn.style.display = 'none';
        }
    }

    setWordOfDay() {
        const word = getRandomItem(WORDS_OF_DAY);
        document.getElementById('wotd-word').textContent = word;
    }

    async handleSearch() {
        const input = document.getElementById('search-input');
        const word = input.value.trim();
        if (word) {
            await this.search(word);
        }
    }

    async search(word) {
        document.getElementById('search-input').value = word;
        toggleLoading(true);

        try {
            const data = await fetchDefinition(word);
            renderResult(data);
            this.addToHistory(data[0].word);
        } catch (error) {
            renderError(error);
        } finally {
            toggleLoading(false);
        }
    }

    addToHistory(word) {
        if (!this.history.includes(word)) {
            this.history.unshift(word);
            if (this.history.length > 10) this.history.pop();
            storage.set('dictionary_history', this.history);
            this.renderHistoryList();
        }
    }

    renderHistoryList() {
        renderHistory(this.history);
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new DictionaryApp();
});

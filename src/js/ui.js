export const renderResult = (data) => {
    const container = document.getElementById('result-container');
    const word = data[0].word;
    const phonetic = data[0].phonetic || (data[0].phonetics.find(p => p.text)?.text) || '';
    const audio = data[0].phonetics.find(p => p.audio && p.audio !== '')?.audio || '';

    let html = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">${word}</h2>
                    ${phonetic ? `<span class="text-blue-500 font-mono text-lg">${phonetic}</span>` : ''}
                </div>
                ${audio ? `
                    <button onclick="new Audio('${audio}').play()" 
                        class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        🔊
                    </button>
                ` : ''}
            </div>
    `;

    data[0].meanings.forEach((meaning, index) => {
        html += `
            <div class="mb-8 last:mb-0">
                <div class="flex items-center gap-4 mb-4">
                    <span class="italic font-bold text-lg text-gray-900 dark:text-white">${meaning.partOfSpeech}</span>
                    <div class="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
                </div>
                
                <ul class="space-y-4">
                    ${meaning.definitions.map(def => `
                        <li class="relative pl-6 text-gray-700 dark:text-gray-300">
                            <span class="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <p class="mb-1">${def.definition}</p>
                            ${def.example ? `<p class="text-gray-500 dark:text-gray-400 text-sm">"${def.example}"</p>` : ''}
                        </li>
                    `).join('')}
                </ul>

                ${meaning.synonyms.length > 0 ? `
                    <div class="mt-4 flex gap-2 flex-wrap">
                        <span class="text-gray-500 dark:text-gray-400 text-sm">Synonyms:</span>
                        ${meaning.synonyms.slice(0, 5).map(syn => `
                            <button class="synonym-btn text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium" data-word="${syn}">${syn}</button>
                        `).join(', ')}
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `
        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500">
            Source: <a href="${data[0].sourceUrls[0]}" target="_blank" class="underline hover:text-blue-500">Wiktionary</a>
        </div>
        </div>
    `;

    container.innerHTML = html;
    container.classList.remove('hidden');
};

export const renderError = (error) => {
    const container = document.getElementById('result-container');
    const errorDiv = document.getElementById('error');
    const errorMsg = document.getElementById('error-msg');

    container.classList.add('hidden');
    errorDiv.classList.remove('hidden');

    if (error.title) {
        errorMsg.textContent = `${error.title} ${error.message} ${error.resolution}`;
    } else {
        errorMsg.textContent = "An unexpected error occurred. Please try again.";
    }
};

export const renderHistory = (history) => {
    const list = document.getElementById('history-list');
    if (history.length === 0) {
        list.innerHTML = '<div class="text-center text-gray-400 py-8">No recent searches</div>';
        return;
    }

    list.innerHTML = history.map(word => `
        <button class="history-item w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center group transition-colors" data-word="${word}">
            <span class="font-medium text-gray-700 dark:text-gray-200">${word}</span>
            <span class="text-gray-400 group-hover:text-blue-500">↗</span>
        </button>
    `).join('');
};

export const toggleLoading = (show) => {
    const loading = document.getElementById('loading');
    const result = document.getElementById('result-container');
    const error = document.getElementById('error');

    if (show) {
        loading.classList.remove('hidden');
        result.classList.add('hidden');
        error.classList.add('hidden');
    } else {
        loading.classList.add('hidden');
    }
};

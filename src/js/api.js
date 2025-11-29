const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

export const fetchDefinition = async (word) => {
    try {
        const response = await fetch(`${API_URL}${word}`);
        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                title: data.title || 'Error',
                message: data.message || 'Something went wrong',
                resolution: data.resolution || 'Please try again.'
            };
        }

        return data;
    } catch (error) {
        throw error;
    }
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_RETRIES = 3;

export const callOpenRouter = async (userPrompt, chatHistory, apiKey, modelId) => {
    if (!apiKey) {
        throw new Error('Configure sua API Key do OpenRouter primeiro.');
    }

    const apiMessages = [
        ...chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
        })),
        { role: 'user', content: userPrompt },
    ];

    const payload = {
        model: modelId,
        messages: apiMessages,
    };

    let retries = 0;

    while (retries <= MAX_RETRIES) {
        try {
            const response = await fetch(OPENROUTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Growth Hub Intelligence Suite',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 429 || response.status >= 500) {
                    const delay = Math.pow(2, retries) * 1000;
                    await new Promise(res => setTimeout(res, delay));
                    retries++;
                    continue;
                }
                if (response.status === 401) {
                    throw new Error('API Key inválida. Verifique sua chave do OpenRouter.');
                }
                throw new Error(errorData.error?.message || 'Falha na comunicação com a IA.');
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || 'Sem resposta do modelo.';
        } catch (err) {
            if (retries === MAX_RETRIES) throw err;
            const delay = Math.pow(2, retries) * 1000;
            await new Promise(res => setTimeout(res, delay));
            retries++;
        }
    }
};

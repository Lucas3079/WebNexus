const fetch = require('node-fetch'); // Usado para fazer requisições HTTP

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // **Substitua este URL pelo "URL do app da web" que você copiou do Google Apps Script no Passo 2.4**
  const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdpeSWXVXBWo7dVeGZ2XBXevQW7QAFNu6qMjSrbzmlxfJOmsE7Am04VpY7mlAns-lS/exec';

  try {
    const formData = JSON.parse(event.body);

    // Transforma os dados do formulário para o formato que o Google Apps Script espera
    // Os nomes das chaves (atendimento, recomendaria, etc.) devem ser exatamente iguais aos `name`s do seu HTML
    const payload = new URLSearchParams();
    for (const key in formData) {
        payload.append(key, formData[key]);
    }

    // Faz a requisição POST para o Google Apps Script
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString()
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script retornou erro: ${response.status} ${response.statusText}`);
    }

    const result = await response.text(); // ou response.json() se o Apps Script retornar JSON

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Dados enviados para o Google Sheets com sucesso!', result })
    };

  } catch (error) {
    console.error('Erro ao processar submissão:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno ao processar seu feedback.', details: error.message })
    };
  }
};

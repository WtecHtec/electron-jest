const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('./config.dev')
const { setGlobalDispatcher, ProxyAgent } = require("undici"); 

const dispatcher = new ProxyAgent({ uri: new URL('http://127.0.0.1:7890').toString() });
setGlobalDispatcher(dispatcher); 
const genAI = new GoogleGenerativeAI(config.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

function geminiApi (app) {
	app.post('/geminiapi', async (req, res) => {
		const prompt = "Write a story about a magic backpack."
		try {
			const result = await model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();
			console.log(text);
			res.json(text)
		} catch (error) {
			console.log('error---', error)
			res.status(500).json( error)
		}
	
	})
}
module.exports = geminiApi
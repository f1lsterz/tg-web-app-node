const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6051525678:AAFs9Vdmu7t3x4fl8bpadd942_qZpKVM6rU'
const webAppUrl = 'https://master--transcendent-tanuki-6e5de3.netlify.app';
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


bot.on('message', async(msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId,'Ниже появится кнопка, заполни форму',{
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму',web_app:{url:webAppUrl + '/form'}}]
                ]
            }
        })
        await bot.sendMessage(chatId,'Переходь до інтернет - магазину',{
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Зробити замовлення', web_app:{url:webAppUrl}}]
                ]
            }
        })
    }
    if (msg?.web_app_data?.data){
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            await bot.sendMessage(chatId, 'Дякую за зворотній зв\'язок!')
            await bot.sendMessage(chatId, 'Ваша країна: ' + data?.country);
            await bot.sendMessage(chatId, 'Ваша вулиця: ' + data?.street);
            setTimeout(async()=>{
                await bot.sendMessage(chatId,'Всю інформацію ви отримаєте в цьому чаті');
            }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
});

app.post('/web-data', async(req, res) =>{
    const {queryId, products, totalPrice} = req.body;

    try{
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryId,
            title:'Успішна купівля',
            input_message_content:{message_text:'Вітаю з купівлею, ви придбали товар на суму ' + totalPrice}
        })
        return res.status(200).json({})
    } catch (e){
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryId,
            title:'Не вдалося придбати товар',
            input_message_content:{message_text:'Не вдалося придбати товар'}
        })
    }
    return res.status(500).json({})
})

const PORT = 8000;

app.listen(PORT,() => console.log('server started on PORT' + PORT))


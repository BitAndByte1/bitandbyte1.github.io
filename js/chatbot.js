import { addAppointment } from './appointments.js';

export function initChatbot() {
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatToggle = document.querySelector('.chatbot-toggle');
    const chatClose = document.querySelector('.chat-close');
    const chatBody = document.querySelector('.chat-body');
    const chatInput = document.querySelector('.chat-input input');
    const chatSend = document.querySelector('.chat-input button');

    let state = 'WELCOME'; // WELCOME, SERVICE, DETAILS, CONTACT, DONE
    let appointmentData = {};

    chatToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('open');
        if (state === 'WELCOME' && chatBody.children.length === 0) {
            addMessage('bot', 'Здравейте! Как мога да ви помогна днес?');
            addOptions(['Заяви Ремонт', 'Взимане от адрес', 'Въпрос']);
        }
    });

    chatClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('open');
    });

    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addOptions(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chat-options';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.onclick = () => handleOptionClick(opt);
            optionsDiv.appendChild(btn);
        });
        chatBody.appendChild(optionsDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleOptionClick(option) {
        addMessage('user', option);
        // Remove options after selection (visual cleanup)
        const lastOptions = chatBody.querySelector('.chat-options:last-child');
        if (lastOptions) lastOptions.remove();

        processInput(option);
    }

    chatSend.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text) {
            addMessage('user', text);
            chatInput.value = '';
            processInput(text);
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') chatSend.click();
    });

    async function processInput(input) {
        // Simple delay for natural feel
        await new Promise(r => setTimeout(r, 500));

        switch (state) {
            case 'WELCOME':
                if (input.includes('Ремонт') || input.includes('Взимане')) {
                    appointmentData.service = input;
                    state = 'DETAILS';
                    addMessage('bot', 'Разбрано. Моля, опишете накратко проблема или какво устройство трябва да ремонтираме/вземем.');
                } else {
                    addMessage('bot', 'Моля свържете се с нас директно на 0884 870 152 за други въпроси.');
                    addOptions(['Заяви Ремонт', 'Взимане от адрес']);
                }
                break;

            case 'DETAILS':
                appointmentData.issue = input;
                state = 'NAME';
                addMessage('bot', 'Благодаря. Как се казвате?');
                break;

            case 'NAME':
                appointmentData.name = input;
                state = 'CONTACT';
                addMessage('bot', 'И накрая, моля оставете телефонен номер за връзка.');
                break;

            case 'CONTACT':
                appointmentData.phone = input;
                state = 'DONE';
                addMessage('bot', 'Обработвам заявката ви...');

                try {
                    await addAppointment(appointmentData);

                    // Send email notification
                    try {
                        await sendEmailNotification(appointmentData);
                        console.log('Email notification sent');
                    } catch (emailErr) {
                        console.error('Failed to send email:', emailErr);
                    }

                    addMessage('bot', 'Вашата заявка е приета успешно! Ще се свържем с вас скоро за потвърждение.');
                } catch (e) {
                    addMessage('bot', 'Възникна грешка при записването. Моля обадете се на 0884 870 152.');
                    console.error(e);
                }
                break;

            case 'DONE':
                addMessage('bot', 'Вече имаме вашата информация. Имате ли друго запитване?');
                addOptions(['Нова заявка']);
                state = 'RESET';
                break;

            case 'RESET':
                if (input === 'Нова заявка') {
                    state = 'WELCOME';
                    appointmentData = {};
                    addMessage('bot', 'Здравейте отново! Как мога да помогна?');
                    addOptions(['Заяви Ремонт', 'Взимане от адрес']);
                }
                break;
        }
    }

    async function sendEmailNotification(data) {
        const email = "request@bitnbytebg.com";
        const subject = `Нова заявка от ${data.name}`;
        const message = `
        Нова заявка за ремонт/услуга:
        
        Име: ${data.name}
        Телефон: ${data.phone}
        Услуга: ${data.service}
        Описание: ${data.issue}
        Дата: ${new Date().toLocaleString('bg-BG')}
        `;

        await fetch(`https://formsubmit.co/ajax/${email}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: subject,
                _cc: "nikolay@bitnbytebg.com",
                name: data.name,
                phone: data.phone,
                service: data.service,
                issue: data.issue,
                message: message
            })
        });
    }
}

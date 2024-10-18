import React, { useState, useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useChat } from '../../hooks/useChat';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../App';



interface ChatProps {
    chatId: string;
}

interface Message {
    id: string;
    text: string;
    sender: string;
}

function formatDate(date: Date) {
    let dateCopy = new Date(date);
    let offset = 0;
    function padTo2Digits(n: number) {
        return n < 10 ? "0" + n : n;
    }

    if (date && date.getUTCHours() > 12) {
        offset = 1;
        dateCopy.setUTCDate(dateCopy.getUTCDate() + offset);
    }
    return [
        dateCopy.getUTCFullYear(),
        padTo2Digits(dateCopy.getUTCMonth() + 1),
        padTo2Digits(dateCopy.getUTCDate()),
    ].join("-");
}

const ChatComponent: React.FC<ChatProps> = ({ chatId }) => {
    const { login } = useTypedSelector((state) => state);
    const chatService = useChat()
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setLoading] = useState(false);

    // Simulate fetching messages
    useEffect(() => {
        setLoading(true);
        handleGetMessage()
        console.log('reloaded useeffect')



    }, [chatId]);

    const handleSendMessage = async () => {
        try {
            if (newMessage.trim()) {
                const response = await chatService.sendMessage(chatId, newMessage);
                const docName = (new Date().valueOf() / 1000).toString();
                const message: Message = {
                    id: docName,
                    text: newMessage,
                    sender: login.username || 'Unknown' // Assuming 'login' state contains 'username'
                };
                await handleGetMessage()

            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const handleGetMessage = async () => {
        try {
            if (newMessage.trim()) {
                let messagesArray: any[] = []
                const response = await chatService.getChatByChatId(chatId, login.user.email);
                console.log('response', response);
                for (let date of (Object.values<any>(response.data))) {
                    for (let post of date) {
                        const message: Message = {
                            id: post.time,
                            text: post.message,
                            sender: post.user || 'Unknown' // Assuming 'login' state contains 'username'
                        };
                        messagesArray.push(message)
                    }
                }
                onSnapshot((collection(firestore, 'chats/' + chatId, formatDate(new Date()))),
                    { includeMetadataChanges: true },
                    async (snapshot) => {
                        console.log('snapshot', snapshot);
                        snapshot.docChanges().forEach((change: any) => {

                            if (change.type === 'added') {
                                const data = change.doc.data();
                                const docName = (new Date().valueOf() / 1000).toString();
                                console.log('snap', change.doc);


                                setMessages((prevMessages: any) => {
                                    // Check if a message with the same id already exists in the array
                                    const messageExists = prevMessages.some((msg: any) => msg.id === docName);

                                    if (!messageExists) {
                                        // If no message with the same id exists, add the new message
                                        return [
                                            ...prevMessages,
                                            {
                                                id: change.doc.id,
                                                text: data.message,
                                                sender: data.user
                                            }
                                        ];
                                    } else {
                                        // If a message with the same id exists, just return the previous messages without adding a new one
                                        return prevMessages;
                                    }
                                });


                                setLoading(false);
                            }
                        });
                    });


            }
        } catch (error) {
            console.log('error', error);
        }
    }

    return (
        <div style={{width: '100%', position:'relative', maxHeight: '20vh', marginTop: '100px'}}>
            {isLoading ? (
                <div>Loading messages...</div> // Replace with a spinner component if available
            ) : (
                <div>
                    {messages.map(message => (
                        <p key={message.id}><strong>{message.sender}:</strong> {message.text}</p>
                    ))}
                </div>
            )}
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
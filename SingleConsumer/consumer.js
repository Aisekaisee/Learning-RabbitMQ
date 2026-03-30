import amqp from 'amqplib';

async function recieveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost:5673");
        const channel = await connection.createChannel();

        await channel.assertQueue("mail_queue",{durable:false});

        channel.consume("mail_queue",(message) => {
            if(message != null){
                console.log("Recv Message",JSON.parse(message.content));
                channel.ack(message);
            }
        })
        
    } catch (error) {
        console.log(error);
    }
}

recieveMail();
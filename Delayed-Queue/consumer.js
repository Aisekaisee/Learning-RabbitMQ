import amqp from 'amqplib';

async function processOrderUpdates() {
    const connection = await amqp.connect("amqp://localhost:5673");
    const channel = await connection.createChannel();

    const queue = "delayed_order_updates_queue";
    await channel.assertQueue(queue,{durable: true});

    channel.consume(
        queue,
        async(batch) => {
            if(batch != null){
                const {batchId,orders} = JSON.parse(batch.content.toString());
                console.log(`Processed order updates task for batch: ${batchId}`)

                // Update order status for the batch
                await updateOrderStatuses(batchId);

                channel.ack(batch);
            }
        },
        {noAck: false}
    );
}

function updateOrderStatuses(batchId){
    // Stimulate order status update
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(
                `Order statuses updated to "Started shipping" for batch: ${batchId}`
            );
            resolve();
        },1000); // Simulate time taken to update order statuses
    });
}

processOrderUpdates();
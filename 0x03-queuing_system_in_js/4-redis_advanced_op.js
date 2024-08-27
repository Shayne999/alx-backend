//using the client to store a hash value
import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.log(`Redis client not connected to the server: ${err.message}`);
});


//setting multiple hash values
function createHashes() {
    const hashkey = 'HolbertonSchools';
    const hashValues = {
        Portland: 50,
        Seattle: 80,
        'New York': 20,
        Bogota: 40,
        Cali: 60,
        Paris: 2
    };

    let fieldSet = 0;
    const totalFileds = Object.keys(hashValues).length;

    for (const [field, value] of Object.entries(hashValues)) {
        client.hset(hashkey, field, value, redis.print);
    }

}


//retrieves the hash values
function displayHashes() {
    const hashkey = 'HolbertonSchools';

    client.hgetall(hashkey, (err, object) => {
        if (err) {
            console.error(`Error retrieving hash: ${err.message}`);
            return;
        }
        console.log(object);
    });
}

createHashes();
displayHashes();

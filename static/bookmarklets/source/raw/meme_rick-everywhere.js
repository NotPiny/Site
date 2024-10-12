(() => {
    const images = document.querySelectorAll('img');
    const rickImages = [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Glasto2023_%28149_of_468%29_%2853009108914%29_%28cropped%29.jpg/220px-Glasto2023_%28149_of_468%29_%2853009108914%29_%28cropped%29.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Rick_Astley_Tivoli_Gardens.jpg/256px-Rick_Astley_Tivoli_Gardens.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Rick_Astley_performing_at_Let%27s_Rock_Bristol%2C_2014.jpg/170px-Rick_Astley_performing_at_Let%27s_Rock_Bristol%2C_2014.jpg',
        'https://i.imgur.com/bMhGih0.jpeg',
        'https://i.imgur.com/zSJgfAT.jpeg',
        'https://media.tenor.com/ktwdEm6Tu6MAAAAC/newmattiou-minejoke.gif'
    ];

    images.forEach(image => {
        image.src = rickImages[Math.floor(Math.random() * rickImages.length)];
    })
})();
document.addEventListener('DOMContentLoaded', () => {
    const imgs = [
        "/Users/jackyduxy/Desktop/Code/Personal Website/110815596_p0_master1200.jpg",
        "/Users/jackyduxy/Desktop/Code/Personal Website/20231223172717.png",
        "/Users/jackyduxy/Desktop/Code/Personal Website/IMG_5310.jpeg",
        "/Users/jackyduxy/Desktop/Code/Personal Website/IMG_5344.jpeg",
        "/Users/jackyduxy/Desktop/Code/Personal Website/IMG_5519.jpeg",
        "/Users/jackyduxy/Desktop/Code/Personal Website/IMG_5751.jpeg",
    ];

    const scrollContainer = document.querySelector('#scrollContainer'); // Use '#' for ID selector

    let currentIndex = 0;

    function createItem(index){
        const imgUrl = imgs[index];
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `<img src="${imgUrl}" alt="Image"/>`;
        scrollContainer.appendChild(item);
        return item;
    }

    function resetElements(){
        scrollContainer.innerHTML = '';
        const prevIndex = currentIndex - 1 < 0 ? imgs.length - 1 : currentIndex - 1;
        const nextIndex = currentIndex + 1 > imgs.length - 1 ? 0 : currentIndex + 1;

        createItem(prevIndex).classList.add('prev');
        createItem(currentIndex).classList.add('cur');
        createItem(nextIndex).classList.add('next');
    }

    resetElements();

    // Adding logging to ensure the event listener is correctly attached
    if (scrollContainer) { 
        // console.log('scrollContainer found and ready to receive wheel events');
        let isAnimating = false;
        scrollContainer.addEventListener('wheel', e => {
            if(!e.deltaY){
                return
            }
            if(isAnimating){
                return;
            }
            isAnimating = true;
            console.log(e.deltaY);
            if(e.deltaY>0){
                // scrollContainer.classList.remove('scroll-up');
                scrollContainer.classList.add('scroll-down');
                currentIndex = currentIndex + 1 > imgs.length - 1 ? 0 : currentIndex+1;
            }
            else{
                // scrollContainer.classList.remove('scroll-down');
                scrollContainer.classList.add('scroll-up');
                currentIndex = currentIndex - 1 < 0 ? imgs.length - 1 : currentIndex-1;


            }
        });
        scrollContainer.addEventListener('transitionend', ()=>{
            isAnimating = false;
            scrollContainer.classList.remove('scroll-down');
            scrollContainer.classList.remove('scroll-up');
            resetElements();
        })
    } else {
        console.error('scrollContainer not found');
    }


});

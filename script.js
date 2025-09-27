// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Elementos da página
    const searchInput = document.getElementById('search-input');
    const productGrid = document.getElementById('product-grid');
    const noResultsMessage = document.getElementById('no-results');
    const shareButton = document.getElementById('share-button');
    
    // Elementos do Modal
    const videoModal = document.getElementById('video-modal');
    const closeModalButton = document.getElementById('close-modal');
    const modalVideoPlayer = document.getElementById('modal-video-player');

    // Função principal para renderizar os produtos
    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        
        if (productsToRender.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        }
        
        noResultsMessage.style.display = 'none';

        productsToRender.forEach(product => {
            let playButtonHTML = '';
            // Se o produto tiver um vídeo, cria o botão de play
            if (product.videoSrc) {
                playButtonHTML = `
                    <button class="play-button" data-video-src="${product.videoSrc}" aria-label="Play video">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clip-rule="evenodd" /></svg>
                    </button>
                `;
            }

            const productCard = document.createElement('div');
            productCard.className = 'product-card-wrapper';
            productCard.innerHTML = `
                <a href="${product.storeLink}" target="_blank" class="product-card" rel="noopener noreferrer">
                    <div class="media-container">
                        <img class="media-image" src="${product.imageSrc}" alt="${product.name}">
                        ${playButtonHTML}
                    </div>
                    <div class="info-container">
                        <p class="product-id">${product.id}</p>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">R$ ${product.price}</p>
                    </div>
                </a>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // --- LÓGICA DO MODAL DE VÍDEO ---
    function openModal(videoSrc) {
        let playerHTML = '';
        if (videoSrc.includes('youtube.com/embed')) {
            playerHTML = `<iframe src="${videoSrc}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            playerHTML = `<video src="${videoSrc}" controls autoplay loop playsinline></video>`;
        }
        modalVideoPlayer.innerHTML = playerHTML;
        videoModal.classList.remove('hidden');
    }

    function closeModal() {
        modalVideoPlayer.innerHTML = ''; // Importante para parar o vídeo
        videoModal.classList.add('hidden');
    }

    // Event listener para abrir o modal (usando delegação de eventos)
    productGrid.addEventListener('click', event => {
        const playButton = event.target.closest('.play-button');
        if (playButton) {
            event.preventDefault(); // Impede que o clique no botão ative o link do card
            const videoSrc = playButton.dataset.videoSrc;
            openModal(videoSrc);
        }
    });

    closeModalButton.addEventListener('click', closeModal);
    videoModal.addEventListener('click', event => {
        // Fecha o modal se clicar no fundo (overlay)
        if (event.target === videoModal) {
            closeModal();
        }
    });

    // --- FILTRO DE BUSCA ---
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredProducts = products.filter(p => p.id.toLowerCase().includes(searchTerm));
        renderProducts(filteredProducts);
    });
    
    // --- BOTÃO COMPARTILHAR ---
    shareButton.addEventListener('click', async () => {
        try {
            await navigator.share({ title: 'Achadinhos Geral', text: 'Confira os melhores produtos!', url: window.location.href });
        } catch (err) {
            alert('Função de compartilhar não disponível neste navegador.');
        }
    });

    // Renderização inicial
    renderProducts(products);
});
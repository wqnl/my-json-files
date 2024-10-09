(function() {
    // Créer et styliser le conteneur principal pour l'IP Locator
    const ipContainer = document.createElement('div');
    ipContainer.id = 'ip-container';
    ipContainer.style.position = 'fixed';
    ipContainer.style.top = '10px';
    ipContainer.style.right = '10px';
    ipContainer.style.width = '400px';
    ipContainer.style.maxHeight = '500px';
    ipContainer.style.overflowY = 'auto';
    ipContainer.style.backgroundColor = '#f7f9fc';
    ipContainer.style.border = '1px solid #ccc';
    ipContainer.style.borderRadius = '12px';
    ipContainer.style.padding = '20px';
    ipContainer.style.zIndex = '10000';
    ipContainer.style.fontFamily = 'Arial, sans-serif';
    ipContainer.style.fontSize = '14px';
    ipContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    ipContainer.style.color = '#333';

    // Créer et styliser le conteneur pour la recherche d'IP
    const ipSearchContainer = document.createElement('div');
    ipSearchContainer.id = 'ip-search-container';
    ipSearchContainer.style.position = 'fixed';
    ipSearchContainer.style.top = '10px';
    ipSearchContainer.style.right = '420px'; // Positionner à côté du conteneur principal
    ipSearchContainer.style.width = '400px';
    ipSearchContainer.style.backgroundColor = '#f7f9fc';
    ipSearchContainer.style.border = '1px solid #ccc';
    ipSearchContainer.style.borderRadius = '12px';
    ipSearchContainer.style.padding = '20px';
    ipSearchContainer.style.zIndex = '10000';
    ipSearchContainer.style.fontFamily = 'Arial, sans-serif';
    ipSearchContainer.style.fontSize = '14px';
    ipSearchContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    ipSearchContainer.style.color = '#333';

    // Ajouter les conteneurs au body
    document.body.appendChild(ipContainer);
    document.body.appendChild(ipSearchContainer);

    // Contenu pour le conteneur principal
    ipContainer.innerHTML = `
        <div id="drag-handle-ip" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; cursor: move;">
            <h3 style="margin: 0; color: #007bff;">Localisateur IP</h3>
            <button id="clear-ip-list" style="padding: 10px 15px; border: none; background-color: #dc3545; color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s;">Effacer</button>
            <button id="close-ip-container" style="padding: 10px 15px; border: none; background-color: #dc3545; color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s;">X</button>
        </div>
        <div id="ip-addresses"></div>
    `;

    // Contenu pour le conteneur de recherche
    ipSearchContainer.innerHTML = `
        <div id="drag-handle-search" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: move;">
            <h3 style="margin: 0; color: #007bff;">Recherche d'IP</h3>
            <button id="close-ip-search-container" style="padding: 10px; border: none; background-color: #dc3545; color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s;">X</button>
        </div>
        <div style="margin-bottom: 10px;">
            <input type="text" id="ip-input" placeholder="Entrez l'adresse IP" style="width: calc(100% - 80px); padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
            <button id="search-ip" style="padding: 10px; border: none; background-color: #007bff; color: white; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">Rechercher</button>
        </div>
        <div id="ip-info" style="margin-top: 10px; background-color: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"></div>
    `;

    // Écouteurs d'événements
    document.getElementById('clear-ip-list').addEventListener('click', () => {
        const ipList = document.getElementById('ip-addresses');
        ipList.innerHTML = '';
    });

    document.getElementById('close-ip-container').addEventListener('click', () => {
        document.body.removeChild(ipContainer);
    });

    document.getElementById('close-ip-search-container').addEventListener('click', () => {
        document.body.removeChild(ipSearchContainer);
    });

    document.getElementById('search-ip').addEventListener('click', () => {
        const ipInput = document.getElementById('ip-input').value;
        fetch(`https://ipinfo.io/${ipInput}/json?token=139232e06f0940`)
            .then(response => response.json())
            .then(data => {
                const ipInfo = document.getElementById('ip-info');
                if (data.error) {
                    ipInfo.innerHTML = `<p>Erreur : ${data.error.message}</p>`;
                } else {
                    ipInfo.innerHTML = `
                        <h4>Informations pour l'IP : ${data.ip}</h4>
                        <p><strong>Ville :</strong> ${data.city || 'N/A'}</p>
                        <p><strong>Région :</strong> ${data.region || 'N/A'}</p>
                        <p><strong>Pays :</strong> ${data.country || 'N/A'}</p>
                        <p><strong>ISP :</strong> ${data.org || 'N/A'}</p>
                        <p><strong>Location :</strong> ${data.loc || 'N/A'}</p>
                        <p><strong>Code postal :</strong> ${data.postal || 'N/A'}</p>
                    `;
                }
            })
            .catch(error => {
                const ipInfo = document.getElementById('ip-info');
                ipInfo.innerHTML = `<p>Erreur lors de la récupération des données : ${error.message}</p>`;
            });
    });

    // Basculer la visibilité des deux conteneurs avec la touche Insert
    let areContainersVisible = true;
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Insert') {
            areContainersVisible = !areContainersVisible;
            ipContainer.style.display = areContainersVisible ? 'block' : 'none';
            ipSearchContainer.style.display = areContainersVisible ? 'block' : 'none';
        }
    });

    // Rendre les conteneurs déplaçables
    makeDraggable(ipContainer, document.getElementById('drag-handle-ip'));
    makeDraggable(ipSearchContainer, document.getElementById('drag-handle-search'));

    function makeDraggable(element, handle) {
        handle = handle || element;
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = (element.offsetTop - posY) + "px";
            element.style.left = (element.offsetLeft - posX) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Mettre à jour la connexion RTCPeerConnection
    window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;

    window.RTCPeerConnection = function(...args) {
        const pc = new window.oRTCPeerConnection(...args);

        pc.oaddIceCandidate = pc.addIceCandidate;

        pc.addIceCandidate = function(iceCandidate, ...rest) {
            const fields = iceCandidate.candidate.split(' ');

            if (fields[7] === 'srflx') {
                const ipAddress = fields[4];
                const currentTime = new Date().toLocaleTimeString();

                // Afficher l'adresse IP détectée
                const ipList = document.getElementById('ip-addresses');
                const ipItem = document.createElement('div');
                ipItem.className = 'ip-item';
                ipItem.innerHTML = `<span><strong>Adresse IP :</strong> ${ipAddress} <strong>Heure :</strong> ${currentTime}</span>`;
                ipList.appendChild(ipItem);
            }

            return pc.oaddIceCandidate(iceCandidate, ...rest);
        }

        return pc;
    }
})();


export function showModal(title, content) {
    const oldModal = document.getElementById("modal-container");

    if (oldModal) {
        oldModal.remove();
    }

    const modal = document.createElement("div");

    modal.id = "modal-container";

    modal.innerHTML = `
        <div class="modal-background">
            <div class="modal-box">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-modal" id="close-modal">×</button>
                </div>

                <div class="modal-content">
                    ${content}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("close-modal").addEventListener("click", closeModal);

    document.querySelector(".modal-background").addEventListener("click", function(event) {
        if (event.target.classList.contains("modal-background")) {
            closeModal();
        }
    });
}

export function closeModal() {
    const modal = document.getElementById("modal-container");

    if (modal) {
        modal.remove();
    }
}

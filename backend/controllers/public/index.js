document.getElementById('update-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const newUsername = document.getElementById('new-username').value;
    const newUsermail = document.getElementById('new-usermail').value;

    try {
        const response = await fetch('/users/update-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newUsername, newUsermail })
        });

        if (response.ok) {
            const updatedUserData = await response.json();

            // Mettre à jour les éléments HTML avec les nouvelles données
            document.getElementById('user-username').innerText = updatedUserData.username;
            document.getElementById('user-email').innerText = updatedUserData.email;

            alert('Informations mises à jour avec succès');
        } else {
            const errorMessage = await response.text();
            alert(`Erreur lors de la mise à jour des informations : ${errorMessage}`);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des informations :', error);
        alert('Erreur lors de la mise à jour des informations. Veuillez réessayer.');
    }
});

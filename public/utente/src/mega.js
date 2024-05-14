const uploadFile = async (input) => {
    const fileInput = input;
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);
    return new Promise((resolve, reject) => {
        fetch("/upload", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("File caricato con successo. Path:", data.Result);
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
const input = document.getElementById("input") //input type="file"
//invia.onclick=>
uploadFile(input)
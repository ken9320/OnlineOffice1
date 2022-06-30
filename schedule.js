
function createtalbe() {
    let id = 0;
    for (let x = 0; x <= 7; x++) {
        for (let y = 0; y <= 24; y++) {
            document.querySelector(".content").innerHTML += `
            <div class="time" data-id="${id}">
            <textarea></textarea>
            </div>`
            id++
        }
    }

    const times = document.querySelectorAll(".time")
    for (const time of times) {
        time.addEventListener("click", function () {
            time.classList.add('active')
            time.querySelector('textarea').focus()
            time.querySelector('textarea').addEventListener('blur', function () {
                // e.stopPropagation()
                // time.classList.remove('active')

                const content = time.querySelector('textarea').value
                const id = time.dataset.id
                // document.querySelector(`#${id}`).innerHTML += `
                // <textarea>${content}</textarea>`
            })
        })
        // document.querySelector(`#${id}`).addEventListener("click", function () {
        //     time.classList.remove('active')
        // });
    }

}
createtalbe();
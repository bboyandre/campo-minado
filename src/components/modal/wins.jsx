import './wins.css'

const Wins = () => {
    let visible = true
    // When the user clicks the button, open the modal 
    const showModal = ()=> {
        let modal = document.getElementById("myModal");
        modal.style.display = "block";
    }
    
    // When the user clicks on <span> (x), close the modal
    const closeModal = ()=> {
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        let modal = document.getElementById("myModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    return (
        <div>
            <h2>Modal Example</h2>
            <button id="myBtn" onClick={() => showModal()}>Open Modal</button>

            <div id="myModal" className="modal">

                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <p>Some text in the Modal..</p>
                </div>

            </div>

        </div>
    )
}

export default Wins
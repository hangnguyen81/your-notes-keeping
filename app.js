// register all variables
const form = document.getElementById('form')
const noteTitle = document.getElementById('note-title')
const noteText = document.getElementById('note-text')
const formButtons = document.getElementById('form-buttons')
const formCloseButton = document.getElementById('form-close-button')
const notes = document.getElementById('notes')
const placeHolder = document.getElementById('placeholder')
const modal = document.querySelector('.modal')
const modalTitle = document.querySelector(".modal-title");
const modalText = document.querySelector(".modal-text");
const modalCloseButton = document.querySelector('.modal-close-button')
const colorTooltip = document.getElementById('color-tooltip')

let listOfNotes = JSON.parse(localStorage.getItem('listOfNotes')) || [] 
let title = ''
let text = ''
let id = ''

renderNotes()

document.body.addEventListener("click", event => {
    handleFormClick(event)
    selectNote(event)
    openModal(event)
    deleteNote(event)   
})


form.addEventListener('submit', function(event){
    event.preventDefault()
    const title = noteTitle.value 
    const text = noteText.value
    const hasNote = title || text
    if (hasNote){
        addNote({title,text})
    }      
    renderNotes()
    closeForm()
})

formCloseButton.addEventListener('click', event =>{
    event.stopPropagation() 
    closeForm()
})

modalCloseButton.addEventListener('click', event =>{
    closeModal(event)
})

document.body.addEventListener('mouseover', event =>{
    openTooltip(event)
})

document.body.addEventListener('mouseout', event =>{
    closeTooltip(event)
})

colorTooltip.addEventListener('mouseover', function(){
    colorTooltip.style.display = 'flex'
})

colorTooltip.addEventListener('mouseout', function(){
    colorTooltip.style.display = 'none'
})

colorTooltip.addEventListener('click', event => {
    const color = event.target.dataset.color
    if (color)
        editNoteColor(color)
})

function saveNote(){
    localStorage.setItem('listOfNotes', JSON.stringify(listOfNotes))
}

function displayNote(){
    const numberOfNotes = listOfNotes.length >0
    placeHolder.style.display = numberOfNotes?'none':'flex'
    
    let noteHtml = ''
    for (let note of listOfNotes){
        noteHtml += `
            <div style="background: ${note.color};" class="note" data-id = ${note.id}>
                <div class="${note.title && 'note-title'}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                        <img class="toolbar-color" data-id=${note.id} src='images/palette.png'> 
                        <img class="toolbar-delete" data-id=${note.id} src='images/delete-icon.png'>
                    </div>
                </div>
            </div>
        `
    }
    notes.innerHTML = noteHtml
}

function renderNotes(){
    saveNote()
    displayNote()
}

function handleFormClick(event){
    const title = noteTitle.value 
    const text = noteText.value
    const hasNote = title || text

    const isFormClicked = form.contains(event.target)
    if (isFormClicked)
        openForm()
    else if (hasNote){
            addNote({title,text})
            renderNotes()
            closeForm()
        }
        else
            closeForm()
}

function openForm(){
    form.classList.add('form-open')
    noteTitle.style.display = 'block'
    formButtons.style.display = 'block'
}

function closeForm(){
    form.classList.remove('form-open')
    noteTitle.style.display = 'none'
    formButtons.style.display = 'none'
    noteTitle.value = ''
    noteText.value = ''
}

function addNote(note){
    const newNote = {
        title: note.title,
        text: note.text,
        color: 'white',
        id: listOfNotes.length > 0 ? listOfNotes[(listOfNotes.length - 1)].id + 1: 1
    }
    listOfNotes.push(newNote)
}

function selectNote(event){
    const selectedNote = event.target.closest('.note')
    if (!selectedNote) return
    const [noteTitle, noteText] = selectedNote.children
    title = noteTitle.innerText
    text = noteText.innerText
    id = selectedNote.dataset.id
}

function editNote(){
    const editedTitle = modalTitle.value
    const editedText = modalText.value    
    id = Number(id)
    for (let note of listOfNotes){       
        if(note.id === id){ 
            note.title = editedTitle
            note.text = editedText
            break
        }
    }
    renderNotes()
}

function openModal(event){
    if (event.target.matches('.toolbar-delete')) 
        return

    if (event.target.closest('.note')){
        modal.classList.toggle('open-modal')
        modalTitle.value = title
        modalText.value = text
    }
}

function closeModal(event){
    editNote()
    modal.classList.toggle('open-modal')
}

function deleteNote(event){
    event.stopPropagation()    
    if (!event.target.matches('.toolbar-delete')) return
    const deletedId = Number(event.target.dataset.id)
    listOfNotes = listOfNotes.filter(note => note.id !=deletedId)
    renderNotes()
}

function openTooltip(event){
    if (!event.target.matches('.toolbar-color')) return
    const toolbarColor = event.target.closest('.toolbar-color')
    id = toolbarColor.dataset.id
    const noteCoords = event.target.getBoundingClientRect()

    const horizontal = noteCoords.left;
    const vertical = window.scrollY - 20;
    colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`
    console.log(colorTooltip.style.transform)
    colorTooltip.style.display = 'flex'
}

function closeTooltip(event){
    if (!event.target.matches('.toolbar-color')) return
    colorTooltip.style.display = 'none'

}

function editNoteColor(color){    
    id = Number(id)
    for (let note of listOfNotes){   
        if(note.id === id){            
            note.color = color        
            break
        }
    }
    renderNotes()
}
        

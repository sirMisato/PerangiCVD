const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableUsers = document.querySelector('.table-users');

let id;

// Create element and render users
const renderUser = doc => {
  const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().NamaTempat}</td>
      <td>${doc.data().Alamat}</td>
      <td>${doc.data().Kota}</td>
      <td>${doc.data().Narahubung}</td>
      <td>${doc.data().Keterangan}</td>
      <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
    </tr>
  `;
  tableUsers.insertAdjacentHTML('beforeend', tr);

  // Click edit user
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show');

    id = doc.id;
    editModalForm.NamaTempat.value = doc.data().NamaTempat;
    editModalForm.Alamat.value = doc.data().Alamat;
    editModalForm.Kota.value = doc.data().Kota;
    editModalForm.Narahubung.value = doc.data().Narahubung;
    editModalForm.Keterangan.value = doc.data().Keterangan;

  });

  // Click delete user
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener('click', () => {
    db.collection('ayovaksin').doc(`${doc.id}`).delete().then(() => {
      console.log('Document succesfully deleted!');
    }).catch(err => {
      console.log('Error removing document', err);
    });
  });

}

// Click add user button
btnAdd.addEventListener('click', () => {
  addModal.classList.add('modal-show');

  addModalForm.NamaTempat.value = '';
  addModalForm.Alamat.value = '';
  addModalForm.Kota.value = '';
  addModalForm.Narahubung.value = '';
  addModalForm.Keterangan.value = '';
});

// User click anyware outside the modal
window.addEventListener('click', e => {
  if(e.target === addModal) {
    addModal.classList.remove('modal-show');
  }
  if(e.target === editModal) {
    editModal.classList.remove('modal-show');
  }
});

// // Get all users
// db.collection('ayovaksin').get().then(querySnapshot => {
//   querySnapshot.forEach(doc => {
//     renderUser(doc);
//   })
// });

// Real time listener
db.collection('ayovaksin').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added') {
      renderUser(change.doc);
    }
    if(change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
    }
    if(change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
      renderUser(change.doc);
    }
  })
})

// Click submit in add modal
addModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('ayovaksin').add({
    NamaTempat: addModalForm.NamaTempat.value,
    Alamat: addModalForm.Alamat.value,
    Kota: addModalForm.Kota.value,
    Narahubung: addModalForm.Narahubung.value,
    Keterangan: addModalForm.Keterangan.value,
  });
  modalWrapper.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('ayovaksin').doc(id).update({
    NamaTempat: editModalForm.NamaTempat.value,
    Alamat: editModalForm.Alamat.value,
    Kota: editModalForm.Kota.value,
    Narahubung: editModalForm.Narahubung.value,
    Keterangan: editModalForm.Keterangan.value,
  });
  editModal.classList.remove('modal-show');
  
});

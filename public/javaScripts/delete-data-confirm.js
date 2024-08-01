document.addEventListener('DOMContentLoaded', () => {
  // 移除按鈕加入事件監聽器
  document.querySelectorAll('.delete-button').forEach(btn => {
    btn.addEventListener('click', function addDeleteDataId(evt) {
      const id = evt.currentTarget.getAttribute('rest-id');
      const deleteBtn = document.getElementById('confirm-delete-button')
      deleteBtn.setAttribute('form', `deleteForm-${id}`)
    })
  })

})
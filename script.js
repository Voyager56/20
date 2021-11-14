const formValidator = (form, fieldsConfig, onValidateSuccess, onValidationError) => {

    const validateField = (fieldElement, fieldConfig) => {
      const value = fieldElement.value;
      const rules = fieldConfig.rules;
      const formGroup = fieldElement.closest('.form-group');
      const errorElement =  formGroup.querySelector('.form-error-message');
  
      const fieldValidationResult = {name: fieldConfig.name, value: value, errors: []};
      rules.forEach(rule => {
        if (rule.required && !value) {
          fieldValidationResult.errors.push(rule.message);
        }
        if (rule.maxLength && `${value}`.length > rule.maxLength) {
          fieldValidationResult.errors.push(rule.message);
        }
        if (rule.mobileNumber && value) {
          if (value.startsWith('+') && value.length !== 13) {
            fieldValidationResult.errors.push(rule.message);
          }
          if (!value.startsWith('+') && value.length !== 9) {
            fieldValidationResult.errors.push(rule.message);
          }
          if (!/^[0-9+]+$/.test(value)) {
            fieldValidationResult.errors.push(rule.message);
          }
        }
        if (rule.pn && value) {
          if (value.length !== 11) {
            fieldValidationResult.errors.push(rule.message);
          }
          if (!/^[0-9]+$/.test(value)) {
            fieldValidationResult.errors.push(rule.message);
          }
        }
      });
  
      if (fieldValidationResult.errors.length > 0) {
        errorElement.innerText = fieldValidationResult.errors.join('\n');
      } else {
        errorElement.innerText = '';
      }
  
      return fieldValidationResult;
    }
  
    const validateOnChange = () => {
      fieldsConfig.forEach((fieldConfig) => {
        const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
        fieldElement.addEventListener('input', e => {
          validateField(e.target, fieldConfig);
        });
      })
    }
  
    const validateOnSubmit = () => {
      const validatedFields = [];
      fieldsConfig.forEach((fieldConfig) => {
        const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
        validatedFields.push(validateField(fieldElement, fieldConfig));
      });
  
      return validatedFields;
    }
  
    const listenFormSubmit = () => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const errors = [];
        const values = {};
        const validationResult = validateOnSubmit();
        validationResult.forEach(result => {
          values[result.name] = result.value;
          errors.push(...result.errors);
        });
        if (errors.length === 0) {
          onValidateSuccess(values);
        } else {
          onValidationError(errors);
        }
      });
    }
    listenFormSubmit();
    validateOnChange();
  
    function setFields(dataObject){
      fieldsConfig.forEach((fieldConfig) => {
        const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
        fieldElement.value = dataObject.hasOwnProperty(fieldConfig.name) ? dataObject[fieldConfig.name]: '';
      })
    }
  
    return {
      setFields,
    }
  }
  
  const fieldsConfig = [
    {name: 'id', rules: [{required: false}]},
    {
      name: 'first_name',
      rules: [
        {required: true, message: 'First name is required.'},
        {maxLength: 10, message: 'სიბოლოების რაოდენობა უნდა იყოს 10 ზე ნაკლები ან ტოლი'},
      ]
    },
    {
      name: 'last_name',
      rules: [
        {required: true, message: 'Last name is required.'},
      ]
    },
    {
      name: 'zip',
      rules: [
        {required: true, message: 'Zip Code name is required.'},
      ]
    },
    {
      name: 'mobile',
      rules: [
        {required:true, message: `Mobile number is required`},
        {mobileNumber: true, message: 'lorem mobile'},
      ]
    },
    {
      name: 'pn',
      rules: [
        {required:true, message: `Personal number is required`},
        {pn: true, message: 'lorem pn'},
      ]
    },
    {
      name: 'email',
      rules: [
        {required: true, message: 'Zip Code name is required.'},
      ]
    },
    {
      name: 'status',
      rules: [
        {required: true, message: 'Zip Code name is required.'},
      ]
    },
    {
      name: 'gender',
      rules: [
        {required: true, message: 'Zip Code name is required.'},
      ]
    }
  ];
  
  const form = document.querySelector('#user-registraion-form');
  
  const onFormSubmitSuccess = (fields) => {
    if(fields.id){
      updateUser(fields);
    }else {
      createUser(fields);
    }
  }
  const onFormSubmitError = (fields) => {
    console.log('Error', fields);
  }
  
  const formManager = formValidator(form, fieldsConfig, onFormSubmitSuccess, onFormSubmitError);
  
  const addUserData = (users,table) => {
    users.forEach((user) => {
        let tableRow = document.createElement(`tr`)
        tableRow.className = `id-${user.id}`
        const userKeys = Object.keys(user)
        userKeys.forEach(key => {
            let tableData = document.createElement(`td`)
            tableData.innerText = user[key]
            tableRow.appendChild(tableData)
        })
        table.appendChild(tableRow)
    })
}
  function renderUsers(users){
    const table = document.querySelector(`.user-table`)
    addUserData(users,table)
    userActions();
  }
  
  async function userActions(){
    // ცხრილში ღილაკებზე უნდა მიამაგროთ event listener-ები
    // იქნება 2 ღილაკი რედაქტირება და წაშლა
    // id შეინახეთ data-user-id ატრიბუტად ღილაკებზე
    // წაშლა ღილაკზე უნდა გაიგზავნოს წაშლის მოთხოვნა და გადაეცეს id
    // ეიდტის ღილაკზე უნდა გაიხსნას მოდალ სადაც ფორმი იქნება
    // ეიდტის ღილაკზე უნდა გამოიძახოთ getUser ფუნქცია და რომ დააბრუნებს ერთი მომხმარებლის დატას (ობიექტს და არა მასივს)
    // ეს დატა უნდა შეივსოს ფორმში formManager აქვს ახალი შესაძლებლობა formManager.setFields(userObject)
    // ეს ფუნქცია გამოიძახე და გადაეცი user-ის დატა

    const tableRows = document.querySelectorAll(`tr`)
    const tableArray = Array.from(tableRows)
    tableArray.shift()
    tableArray.forEach((array,index) => {
      const editBtn = document.createElement(`button`)
      const dltBtn = document.createElement(`button`)
      const id = array.className.replace(/\D/g,'');
      editBtn.innerText = `Edit`
      dltBtn.innerText = `Delete`
      editBtn.setAttribute(`data-user-id`, `${id}`)
      editBtn.addEventListener(`click`, () => editUser(id))
      dltBtn.setAttribute(`data-user-id`, `${id}`)
      dltBtn.addEventListener(`click`, () => deleteUser(id))
      tableRows[index+1].appendChild(editBtn)
      tableRows[index+1].appendChild(dltBtn)
    })
  }
  
  async function editUser(userID){
    modalBody.style.display = `initial`
    const user = await getUser(userID)
    formManager.setFields(user)
  }
  async function getUsers(){
    try {
      const response = await fetch('http://api.kesho.me/v1/user-test/index');
      const users = await response.json();
      renderUsers(users);
    } catch (e){
      console.log('Error - ', e);
    }
  }
  getUsers();
  /**
   *
   * შეგიძლიათ callback გადმოსცეთ ამ ფუნქციას და await response.json() რასაც დააბრუნებს ის გადასცეთ უკან
   * ან await response.json() დააბრუნოთ და საიდანაც გამოიძახებთ ამ ფუნქციას იქაც await უნდა დაუწეროთ რომ დატა დაგიბრუნოთ
   *
   * @param userId
   * @param cb callback function
   * @returns {Promise<void>}
   */
  async function getUser(userId, cb) {
    try {
     const response = await fetch(`http://api.kesho.me/v1/user-test/view?id=${userId}`)
     const data = await response.json();
     return data
      // cb(data)
    } catch (e) {
      console.log('Error - ', e);
    }
  }
  async function createUser(userData){
    try {
      const response = await fetch('http://api.kesho.me/v1/user-test/create', {
        method: 'post',
        body: JSON.stringify(userData),
        headers: {'Content-Type': 'application/json'}
      });
      await response.json();
      clearTable()
      getUsers(); // შენახვის ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ უსერები
    }catch (e){
      console.log('Error - ', e);
    }
  }
  async function updateUser(userObject) {
    try{
      const response = await fetch(`http://api.kesho.me/v1/user-test/update?id=${userObject.id}`,{
        method: 'post',
        body: JSON.stringify(userObject),
        headers: {'Content-Type': 'application/json'}
      })
      .then(response => response.json)     
      clearTable()
      getUsers()
    }catch (error){
      console.error(error)
    }
    
  }
  async function deleteUser(userId) {
    // DELETE `http://api.kesho.me/v1/user-test/delete?id=${userId}`
    try{
      const response = await fetch(`http://api.kesho.me/v1/user-test/delete?id=${userId}`,{
        method: 'DELETE',
        // headers: {'Content-Type': 'application/json'}
      })
      .then(response => response.json)
      clearTable()
      getUsers()
    }catch (error){
      console.error(error)
    }
  }
  const modalBody = document.querySelector(`.modal`)
  const newUsersBtn = document.querySelector('.new-user');
  const closeButton = document.querySelector(`.modal-header`)
  newUsersBtn.addEventListener('click', e => {
    modalBody.style.display = `initial`
  })
  closeButton.addEventListener(`click`, () => {
    modalBody.style.display = `none`
    fieldsConfig.forEach(config => {
    const fieldElement = form.querySelector(`[name="${config.name}"]`);
    fieldElement.value = ``
    })
  })

  const clearTable = () =>{
      const userTables =Array.from(document.querySelectorAll(`tr`))
      userTables.shift();
      userTables.forEach(userTable => {
        userTable.remove()
      })
  }
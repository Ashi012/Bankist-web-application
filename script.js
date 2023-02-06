'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Ashi Goel',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2021-11-18T21:21:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2021-01-28T07:15:04.904Z',
    '2022-02-01T07:17:24.185Z',
    '2022-03-08T07:11:59.604Z',
    '2022-04-27T07:01:17.194Z',
    '2023-02-01T07:36:20.929Z',
    '2023-01-30T07:36:20.929Z',
  ]
}
const account2 = {
  owner: 'Rahul Sharma',
movements: [5000513400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2021-11-18T21:21:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2021-01-28T07:15:04.904Z',
    '2022-02-01T07:17:24.185Z',
    '2022-03-08T07:11:59.604Z',
    '2022-04-27T07:01:17.194Z',
    '2022-05-11T07:36:20.929Z',
    '2022-06-11T07:36:20.929Z',
  ]
};

const account3 = {
  owner: 'Siya bedi',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2021-11-18T21:21:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2021-01-28T07:15:04.904Z',
    '2022-02-01T07:17:24.185Z',
    '2022-03-08T07:11:59.604Z',
    '2022-04-27T07:01:17.194Z',
    '2022-05-11T07:36:20.929Z',
    '2022-06-11T07:36:20.929Z',
  ]
};

const account4 = {
  owner: 'Sarah Gupta',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2021-11-18T21:21:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2021-01-28T07:15:04.904Z',
    '2022-02-01T07:17:24.185Z',
    '2022-03-08T07:11:59.604Z',
    '2022-04-27T07:01:17.194Z',
    '2023-02-01T07:36:20.929Z',
    '2023-01-30T07:36:20.929Z',
  ]
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const formatMov = function(date,locale){

  const calcDays = (date1 , date2)=>
  Math.round(Math.abs(date2-date1) / (1000*60*60*24));

  const daysPassed = calcDays(new Date(),date);
  console.log(daysPassed);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1)return 'Yesterday';
  if(daysPassed <=7) return `${daysPassed} days ago`;
  
    // const day = `${date.getDate()}`.padStart(2,0);
    // const month = `${date.getMonth()+ 1}`.padStart(2,0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  

}


const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => 
  a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMov(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${Math.round(mov.toFixed(2))}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) =>
    acc + mov, 0);
  labelBalance.textContent =`${Math.round(acc.balance.toFixed(2))}€`;
}



const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${Math.round(income.toFixed(2))}€`;

  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, curr) => acc + curr, 0);

  labelSumOut.textContent = `${Math.round(Math.abs(out).toFixed(2))}€`;

  const interest = acc.movements
    .filter(mov => mov>0)
    .map(deposit => (deposit * acc.interestRate) /100 )
    .filter((int,i,arr) => {
      return int >= 1;
    })
    .reduce((acc, curr) => acc + curr, 0);
    
labelSumInterest.textContent = `${Math.round(interest.toFixed(2))}€`;

}


const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('')
       
  });
};
createUsernames(accounts);


const updateUI = function(acc){
  //display movements
  displayMovements(acc);
  //display balanse
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
}

const startLogoutTimer = function(){
  const tick = function(){
    const min = String(Math.trunc(time/60)).padStart(2,0);
      const sec = String(time%60).padStart(2,0);
      labelTimer.textContent = `${min}:${sec}`;
  
      if(time === 0){
        clearInterval(timer);
        labelWelcome.textContent = 'Login to get Started';
        containerApp.style.opacity = 0;
      }

      time--;
  }
  
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000); 
  return timer;
}
let currentAccount,timer;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options ={
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    }
    const locale = navigator.language;
    console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat
    (locale,options).format(now);

    // const day = `${now.getDate()}`.padStart(2,0);
    // const month = `${now.getMonth()+ 1}`.padStart(2,0);
    // const year = `${now.getFullYear()}`.padStart(2,0);
    // const hour = `${now.getHours()}`.padStart(2,0);
    // const min = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year} , ${hour}:${min}`;



    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if(timer) clearInterval(timer);
    timer=startLogoutTimer();


    updateUI(currentAccount);

    
  }
});


btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
inputTransferAmount.value = inputTransferTo.value = '';

  if(amount>0 && receiverAcc && currentAccount.balance>=amount &&receiverAcc.username !== currentAccount.username){
    console.log('Transfer valid')
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogoutTimer();
  }
  
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function(){
      currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date());
    // Update UI
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogoutTimer();
    },2000)
    
  }
  inputLoanAmount.value = '';
} );

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


/////////////////////////////////////////////////








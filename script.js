"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Dalveer Singh",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//Functions
const displaymovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  //sort movements
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDates = showDate(date);
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}"> ${type}</div>
          <div class="movements__date">${displayDates}</div>
          <div class="movements__value">${formatCurncy(acc, mov)}</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html); //To add html into webpage.
  });
};

function calcDisplayBalance(acc) {
  //Calculate the total balance
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCurncy(acc, acc.balance)}`;
}

const calcDisplaySummry = function (acc) {
  const depostis = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCurncy(acc, depostis)}`;

  const withdrawals = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${formatCurncy(acc, withdrawals)}`;

  const intrest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${formatCurncy(acc, intrest)}`;
};

function createUsername(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}

createUsername(accounts);

function updateUI(acc) {
  //To display account movments
  displaymovements(acc);
  //To display account balance
  calcDisplayBalance(acc);
  // To display account summry
  calcDisplaySummry(acc);
}

function showDate(date) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  };
  return new Intl.DateTimeFormat(currentAccount.locale, options).format(date);
}

//Format currency
function formatCurncy(acc, mov) {
  const curncy = new Intl.NumberFormat(acc.locale, {
    style: "currency",
    currency: acc.currency,
  }).format(mov);
  return curncy;
}

//Implement Timer
function startLogOutTimer() {
  const tick = () => {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      currentAccount = "";
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
//Variables

let currentAccount, timer;

//Event handlers

//For login field
btnLogin.addEventListener("click", function (event) {
  event.preventDefault(); //Stoping page reloding on clicking login button.

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`;

    containerApp.style.opacity = 100;
    //Showing current date with current balance
    const currentDate = new Date();
    labelDate.textContent = `${showDate(currentDate)}`;

    //clear the input filds
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); //To lose the focus form pin input field

    //Start Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

//For transfering money
btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //add balance into movments
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add date in transfer accounts
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();
});

// For money loan
btnLoan.addEventListener("click", function (event) {
  event.preventDefault();
  const loanAmount = +inputLoanAmount.value;
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    setTimeout(function () {
      //Add movment
      currentAccount.movements.push(loanAmount);

      //Add date in loan account
      currentAccount.movementsDates.push(new Date().toISOString());

      //reset timer
      clearInterval(timer);
      timer = startLogOutTimer();

      //update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

//For close account
btnClose.addEventListener("click", function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => (acc.username = currentAccount.username)
    );
    //delete account
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

//For sort movments
let sorted = false;
btnSort.addEventListener("click", function (event) {
  event.preventDefault();
  displaymovements(currentAccount, !sorted);
  sorted = !sorted;
  btnSort.blur();
});

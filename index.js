const calendarGrid = 42   // 7 * 6 grid
let date = new Date()

// 传入一个整数，判断某一年是否为闰年
function isLeap(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

// 获取某月有几天
function getDays(year, month) {
  const feb = isLeap(year) ? 29 : 28
  const daysPerMonth = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return daysPerMonth[month - 1]
}

// 获取 下个月 上个月 有多少天
function getNextOrLastDays(date, type) {
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  if (type === 'last') {
    const lastMonth = (month === 1 ? 12 : month - 1)
    const lastYear = (month === 1 ? year - 1 : year)
    return {
      year: lastYear,
      month: lastMonth,
      days: getDays(lastYear, lastMonth)
    }
  }
  if (type === 'next') {
    const nextMonth = (month === 12 ? 1 : month + 1)
    const nextYear = (month === 12 ? year + 1 : year)
    return {
      year: nextYear,
      month: nextMonth,
      days: getDays(nextYear, nextMonth)
    }
  }
}

// 生成日历数据
function generateCalendar(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const days = getDays(year, month)
  // 1号是星期几
  const weekIndex = new Date(`${year}/${month}/1`).getDay() // 0-6

  // 解构赋值
  const {
    year: lastYear,
    month: lastMonth,
    days: lastDays
  } = getNextOrLastDays(date, 'last')
  const {
    year: nextYear,
    month: nextMonth,
  } = getNextOrLastDays(date, 'next')

  // 日历数据
  const calendarTable = []
  for (let i = 0; i < calendarGrid; i++) {
    if (i < weekIndex) {
      calendarTable[i] = {
        year: lastYear,
        month: lastMonth,
        day: lastDays - weekIndex + i + 1,
        isCurrentMonth: false
      }
    } else if (i >= days + weekIndex) {
      calendarTable[i] = {
        year: nextYear,
        month: nextMonth,
        day: i + 1 - days - weekIndex,
        isCurrentMonth: false
      }
    } else {
      calendarTable[i] = {
        year: year,
        month: month,
        day: i + 1 - weekIndex,
        isCurrentMonth: true
      }
    }
  }
  return calendarTable
}


// 渲染日历
function renderCalendar(create = false) {
  const calendarData = generateCalendar(date)
  // 标题
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  title.innerText = `${year}年${month}月`
  // content
  const content = document.getElementById('content')
  if (create) {
    const fragment = document.createDocumentFragment();

    calendarData.forEach(item => {
      const button = document.createElement('button')
      
      const dateString = `${item.year}/${item.month}/${item.day}`
      // 设置属性
      button.setAttribute('date', dateString)
      button.innerText = item.day

      // 添加样式
      if (!item.isCurrentMonth) button.classList.add('grey')
      if (item.day === day && item.month === month) {
        button.classList.add('selected', 'today')
      }
      // 添加监听
      button.addEventListener('click', () => {
        selectDate(button)
        console.log(dateString)
      })

      fragment.appendChild(button)
    })
    content.appendChild(fragment)
  } else {
    calendarData.forEach((item, idx) => {
      const button = content.children[idx]
      // 清除样式
      button.classList.remove('grey')
      button.classList.remove('selected')
      button.classList.remove('today')

      button.innerText = item.day
      if (!item.isCurrentMonth) button.classList.add('grey')
      if (item.day === day && item.month === month) 
        button.classList.add('selected')
      const today = new Date()
      if (today.getMonth()+1 === month && 
          today.getFullYear() === year &&
          today.getDate() === item.day && 
          item.isCurrentMonth)
        button.classList.add('today')
    })
  }
  // console.log(date)
}

// 改变月份
function changeMonth(type) {
  const newDays = getNextOrLastDays(date, type)
  const year = newDays.year
  const month = newDays.month
  date.setFullYear(year)
  date.setMonth(month - 1)
  date.setDate(1)
  renderCalendar()
}

// 选中日期
function selectDate(button) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const newDay = Number(button.innerText)
  date.setDate(newDay)

  if (button.className === 'grey') {
    let newMonth, newYear
    if (newDay < 15) { // next
      newMonth = (month === 12 ? 1 : month + 1)
      newYear = (month === 12 ? year + 1 : year)
    } else { // last
      newMonth = (month === 1 ? 12 : month - 1)
      newYear = (month === 1 ? year - 1 : year)
    }

    date.setMonth(newMonth - 1)
    date.setFullYear(newYear)
  }
  renderCalendar()
}

// 获取选择的日期
function getSelectedDate() {
  const selectedBtn = document.querySelector('#content button.selected')
  return selectedBtn.getAttribute('date')
}

document.querySelector('.left').onclick = () => changeMonth('last')
document.querySelector('.right').onclick = () => changeMonth('next')
document.querySelector('.skipToToday').onclick = () => {
  date = new Date()
  renderCalendar()
}


window.onload = () => {
  renderCalendar(true)
  console.log(date)
}
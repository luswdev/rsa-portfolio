
Chart.defaults.font.family = '"Rubik", sans-serif'
Chart.defaults.color = '#9E9E9E'

const app = {
    data() {
        return {
            portfolio: [],
            assert: [],
            portfolioEdit: [],
            assertEdit: [],
            rules: rules,
            ruleUpdate: ruleUpdate,
            totalGain: 0,
            totalCost: 0,
            totalCostLabel: 0,
            totalReturn: 0,
            totalGainLoss: 0,
            lastGain: 0,
            lastChange: 0,
            lastChangeUpdated: false,
            twdusd: 0,
            usVisual: false,
            twVisual: false,
            costVisual: false,
            editValid: true,
            refreshTime: '-',
            refreshing: false,
            editModal: undefined,
        }
    },
    methods: {
        growthChart() {
            return this._growthChart;
        },
        returnChart() {
            return this._returnChart;
        },
        drawdownChart() {
            return this._drawdownChart;
        },
        allocChart() {
            return this._allocChart;
        },
        getCurrency: async function (ticker) {
            let res = await axios({
                method: 'get',
                url: `https://fin.lusw.dev/currency/${ticker}`,
            })
            return res.data.current
        },
        getStock: async function (ticker) {
            if (!isNaN(parseInt(ticker))) {
                ticker += '.TW'
            }

            let res =await axios({
                method: 'get',
                url: `https://fin.lusw.dev/stock/${ticker}`,
            })
            return res.data.current
        },
        getLastChange: async function (ticker) {
            if (!isNaN(parseInt(ticker))) {
                ticker += '.TW'
            }

            let res = 0
            await axios({
                method: 'get',
                url: `https://fin.lusw.dev/stock/${ticker}`,
            }).then( (response) => {
                res = response.data.last
            })
            return res
        },
        drawGrowthChart: function (portfolio) {
            const ctx = document.getElementById('rsa-portfolio')

            const data = {
                labels: portfolio.map( (item) => item.date ),
                datasets: [
                    {
                        label: 'Cost (US)',
                        data: portfolio.map( (item) => item.us.cost * this.twdusd ),
                        borderColor: '#26C6DA',
                        backgroundColor: '#26C6DA',
                        pointBackgroundColor: '#26C6DA',
                        pointBorderWidth: 1,
                        pointHoverBorderWidth: 5,
                        pointBorderColor: 'rgb(38, 198, 218, 0.375)',
                        pointStyle: 'circle',
                        pointHoverRadius: 5,
                        pointRadius: 0,
                        borderDash: [8, 8],
                    },
                    {
                        label: 'Balance (US)',
                        data: portfolio.map( (item) => item.us.value * this.twdusd ),
                        borderColor: '#26C6DA',
                        backgroundColor: '#26C6DA',
                        pointBackgroundColor: '#26C6DA',
                        pointBorderWidth: 1,
                        pointHoverBorderWidth: 5,
                        pointBorderColor: 'rgb(38, 198, 218, 0.375)',
                        pointStyle: 'circle',
                        pointHoverRadius: 5,
                        pointRadius: 0,
                        pointRadius: 0,
                    },
                    {
                        label: 'Cost (TW)',
                        data: portfolio.map( (item) => item.tw.cost ),
                        borderColor: '#7E57C2',
                        backgroundColor: '#7E57C2',
                        pointBackgroundColor: '#7E57C2',
                        pointBorderWidth: 1,
                        pointHoverBorderWidth: 5,
                        pointBorderColor: 'rgb(126, 87, 194, 0.375)',
                        pointStyle: 'rect',
                        pointHoverRadius: 5,
                        pointRadius: 0,
                        borderDash: [8, 8],
                    },
                    {
                        label: 'Balance (TW)',
                        data: portfolio.map( (item) => item.tw.value ),
                        borderColor: '#7E57C2',
                        backgroundColor: '#7E57C2',
                        pointBackgroundColor: '#7E57C2',
                        pointBorderWidth: 1,
                        pointHoverBorderWidth: 5,
                        pointBorderColor: 'rgb(126, 87, 194, 0.375)',
                        pointStyle: 'rect',
                        pointHoverRadius: 5,
                        pointRadius: 0,
                    },
                    {
                        label: 'Total Cost',
                        data: portfolio.map( (item) => item.us.cost * this.twdusd + item.tw.cost ),
                        borderColor: '#AED581',
                        backgroundColor: '#AED581',
                        pointBackgroundColor: '#AED581',
                        pointBorderWidth: 1,
                        pointHoverBorderWidth: 5,
                        pointBorderColor: 'rgb(174, 213, 129, 0.375)',
                        pointStyle: 'triangle',
                        pointHoverRadius: 5,
                        pointRadius: 0,
                        borderDash: [8, 8],
                    },
                    {
                        label: 'Total Balance',
                        data: portfolio.map( (item) => item.us.value * this.twdusd + item.tw.value ),
                        borderColor: '#AED581',
                        backgroundColor: '#AED581',
                        pointBackgroundColor: '#AED581',
                        pointBorderWidth: 1,
                        pointHoverBorderWidth: 5,
                        pointBorderColor: 'rgb(174, 213, 129, 0.375)',
                        pointStyle: 'triangle',
                        pointHoverRadius: 5,
                        pointRadius: 0,
                    },
                ]
            }

            const config = {
                type: 'line',
                data: data,
                options: {
                    maintainAspectRatio: false,
                    clip: false,
                    responsive: true,
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                            },
                        },
                        title: {
                            display: false,
                        },
                        tooltip: {
                            usePointStyle: true,
                            callbacks: {
                                label: (tooltipItem) => {
                                    let tooltipLabel = tooltipItem.dataset.label
                                    let tooltipData = tooltipItem.dataset.data[tooltipItem.dataIndex].toLocaleString('en-US', { style: 'currency', currency: 'TWD' })
                                    return ` ${tooltipLabel}: ${tooltipData}`
                                }
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                text: 'Month',
                                display: true,
                            },
                            border: {
                                display: false,
                            },
                            grid: {
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 0,
                            },
                        },
                        y: {
                            title: {
                                text: 'Balance',
                                display: true,
                            },
                            border: {
                                display: false
                            },
                            grid: {
                                color: '#333',
                            },
                            ticks: {
                                callback: (value) => {
                                    return value.toLocaleString('en-US', { style: 'currency', currency: 'TWD' })
                                },
                            },
                        },
                    },
                },
            }

            this._growthChart = new Chart(ctx, config)
        },
        drawDrawdownChart: function (portfolio) {
            const ctx = document.getElementById('drawdown-portfolio')

            const data = {
                labels: portfolio.map( (item) => item.date ),
                datasets: [
                    {
                        label: 'US',
                        fill: true,
                        backgroundColor: 'rgb(38, 198, 218, 0.2)',
                        data: portfolio.map( (item) => Math.min(this.calcGain(item.us.value, item.us.cost).percent, 0) ),
                        borderColor: '#26C6DA',
                        strokeColor: '#26C6DA',
                        pointBackgroundColor: '#26C6DA',
                        pointBorderWidth: 1,
                        pointHoverBorderWidth: 5,
                        pointBorderColor: 'rgb(38, 198, 218, 0.375)',
                        pointStyle: 'circle',
                        pointHoverRadius: 5,
                        pointRadius: 0,
                    },
                    {
                        label: 'TW',
                        fill: true,
                        backgroundColor: 'rgb(121, 134, 203, 0.2)',
                        data: portfolio.map( (item) => Math.min(this.calcGain(item.tw.value, item.tw.cost).percent, 0) ),
                        borderColor: '#7986CB',
                        strokeColor: '#7986CB',
                        pointBackgroundColor: '#7986CB',
                        pointBorderWidth: 1,
                        pointHoverBorderWidth: 5,
                        pointBorderColor: 'rgb(121, 134, 203, 0.375)',
                        pointStyle: 'rect',
                        pointHoverRadius: 5,
                        pointRadius: 0,
                    },
                    {
                        label: 'Total',
                        fill: true,
                        backgroundColor: 'rgb(129, 199, 132, 0.2)',
                        data: portfolio.map( (item) => Math.min(this.calcGain(item.us.value * this.twdusd + item.tw.value, item.us.cost * this.twdusd + item.tw.cost).percent, 0) ),
                        borderColor: '#81C784',
                        strokeColor: '#81C784',
                        pointBackgroundColor: '#81C784',
                        pointBorderWidth: 1,
                        pointHoverBorderWidth: 5,
                        pointBorderColor: 'rgb(129, 199, 132, 0.375)',
                        pointStyle: 'triangle',
                        pointHoverRadius: 5,
                        pointRadius: 0,
                    },
                ]
            }

            const config = {
                type: 'line',
                data: data,
                options: {
                    clip: false,
                    maintainAspectRatio: false,
                    responsive: true,
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                            },
                        },
                        title: {
                            display: false,
                        },
                        tooltip: {
                            usePointStyle: true,
                            callbacks: {
                                label: (tooltipItem) => {
                                    let tooltipLabel = tooltipItem.dataset.label
                                    let tooltipData = this.fixNum(tooltipItem.dataset.data[tooltipItem.dataIndex] * 100)
                                    return ` ${tooltipLabel}: ${tooltipData}%`
                                }
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                text: 'Month',
                                display: true,
                            },
                            border: {
                                display: false,
                            },
                            grid: {
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 0,
                            },
                        },
                        y: {
                            max: 0,
                            title: {
                                text: 'Drawdown',
                                display: true,
                            },
                            border: {
                                display: false
                            },
                            grid: {
                                color: '#333',
                            },
                            ticks: {
                                callback: (value) => {
                                    return `${this.fixNum(value * 100)}%`
                                },
                                format: {
                                    style: 'percent',
                                },
                            },
                        },
                    },
                },
            }

            this._drawdownChart = new Chart(ctx, config)
        },
        drawAllocationChart: function (assert) {
            const ctx = document.getElementById('allocation-portfolio')

            const data = {
                labels: assert.map( (item) => item.ticker ),
                datasets: [
                    {
                        label: 'Weight Outer',
                        data: assert.map( (item) => this.calcAlloc(item.ticker, item.quantity * item.last) ),
                        borderWidth: 0,
                        backgroundColor: assert.map( (item) => this.hexToRgba(item.color, 0.4) ),
                        radius: 0
                    },
                    {
                        label: 'Weight',
                        data: assert.map( (item) => this.calcAlloc(item.ticker, item.quantity * item.last) ),
                        borderWidth: 2,
                        borderColor: '#212529',
                        backgroundColor: assert.map( (item) => item.color ),
                    }
                ]
            }

            const config = {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                            },
                        },
                        title: {
                            display: false,
                        },
                        tooltip: {
                            usePointStyle: true,
                            callbacks: {
                                label: (tooltipItem) => {
                                    let tooltipData = this.fixNum(tooltipItem.dataset.data[tooltipItem.dataIndex])
                                    let total = 0;
                                    for (let data of tooltipItem.dataset.data) {
                                        total += parseFloat(data)
                                    }
                                    let tooltipPercentage = this.fixNum(Math.round((tooltipData / total) * 100))
                                    return ` ${tooltipItem.dataset.label}: ${tooltipData.toLocaleString('en-US', { style: 'currency', currency: 'TWD' })} (${tooltipPercentage}%)`
                                }
                            },
                        },
                    },
                    onHover: (evt, activeEls, chart) => {
                        chart.getDatasetMeta(0).data.forEach(dp => {
                            dp.innerRadius = 0
                            dp.outerRadius = 0
                        });

                        if (activeEls.length === 0 || activeEls[0]?.datasetIndex === 0) {
                            return
                        }

                        const hovered = activeEls[0]
                        const dpPointToEnlarge = chart.getDatasetMeta(0).data[hovered.index]

                        dpPointToEnlarge.innerRadius = hovered.element.outerRadius
                        dpPointToEnlarge.outerRadius = hovered.element.outerRadius + (hovered.element.outerRadius - hovered.element.innerRadius) / 2
                    },
                },
            }

            this._allocChart = new Chart(ctx, config)
        },
        drawReturnChart: function (portfolio) {
            const ctx = document.getElementById('return-portfolio')

            const data = {
                labels: portfolio.map( (item) => item.date ),
                datasets: [
                    {
                        label: 'US',
                        data: portfolio.map( (item) => (item.us.value - item.us.cost) * this.twdusd ),
                        borderColor: '#B2EBF2',
                        backgroundColor: '#26C6DA',
                        stack: 'Stack Split',
                        pointStyle: 'circle',
                    },
                    {
                        label: 'TW',
                        data: portfolio.map( (item) => item.tw.value - item.tw.cost ),
                        borderColor: '#C5CAE9',
                        backgroundColor: '#7986CB',
                        stack: 'Stack Split',
                        pointStyle: 'rect',
                    },
                    {
                        label: 'Total',
                        data: portfolio.map( (item) => (item.us.value * this.twdusd + item.tw.value) - (item.us.cost * this.twdusd + item.tw.cost) ),
                        borderColor: '#DCEDC8',
                        backgroundColor: '#AED581',
                        stack: 'Stack Total',
                        pointStyle: 'triangle',
                    },
                ]
            }

            const config = {
                type: 'bar',
                data: data,
                options: {
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                            },
                        },
                        title: {
                            display: false,
                        },
                        tooltip: {
                            usePointStyle: true,
                            callbacks: {
                                label: (tooltipItem) => {
                                    let tooltipLabel = tooltipItem.dataset.label
                                    let tooltipData = tooltipItem.dataset.data[tooltipItem.dataIndex].toLocaleString('en-US', { style: 'currency', currency: 'TWD' })
                                    return ` ${tooltipLabel}: ${tooltipData}`
                                }
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                text: 'Month',
                                display: true,
                            },
                            stacked: true,
                            border: {
                                display: false,
                            },
                            grid: {
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 0,
                            },
                        },
                        y: {
                            title: {
                                text: 'Gain/Loss',
                                display: true,
                            },
                            stacked: true,
                            border: {
                                display: false
                            },
                            grid: {
                                color: '#333',
                            },
                            ticks: {
                                callback: (value) => {
                                    return value.toLocaleString('en-US', { style: 'currency', currency: 'TWD' })
                                },
                            }
                        },
                    },
                },
            }

            this._returnChart = new Chart(ctx, config)
        },
        toggleUS: function () {
            this.growthChart().getDatasetMeta(0).hidden = !this.usVisual
            this.growthChart().getDatasetMeta(1).hidden = !this.usVisual

            this.growthChart().update()
        },
        toggleTW: function () {
            this.growthChart().getDatasetMeta(2).hidden = !this.twVisual
            this.growthChart().getDatasetMeta(3).hidden = !this.twVisual

            this.growthChart().update()
        },
        toggleCost: function () {
            this.growthChart().getDatasetMeta(0).hidden = !this.costVisual
            this.growthChart().getDatasetMeta(2).hidden = !this.costVisual
            this.growthChart().getDatasetMeta(4).hidden = !this.costVisual

            this.growthChart().update()
        },
        calcGain: function (balance, cost) {
            return {
                value: balance - cost,
                percent: (balance / cost - 1)
            }
        },
        calcAlloc: function (ticker, balance) {
            if (isNaN(parseInt(ticker))) {
                return balance * this.twdusd
            }
            return balance
        },
        calcCAGR: function (idx, balance, cost) {
            return (Math.pow(((balance - cost) / cost + 1), (12 / (idx + 1))) - 1) * 100
        },
        formatDate: function (date) {
            const options = {
                weekday:undefined,
                year: 'numeric',
                month: 'long',
                day: undefined,
            }
            let dateObj = new Date(date)
            return dateObj.toLocaleDateString('en-US', options)
        },
        fixNum: function (value, cnt = 2) {
            if (isNaN(Number(value))) {
                value = 0
            }

            return Number(value.toFixed(cnt))
        },
        doLogout: function () {
            axios.delete('/login').then(() => {
                window.location = '/login.html'
            })
        },
        appendEmptyAssert: function () {
            this.assertEdit.push({
                'ticker': '',
                'name': '',
                'quantity': 0,
                'cost': 0,
                'color': '#000000',
            })
        },
        appendEmptyHistory: function () {
            this.portfolioEdit.push({
                'date': '',
                'us': {
                    'cost': 0,
                    'value': 0,
                },
                'tw': {
                    'cost': 0,
                    'value': 0,
                },
            })
        },
        indexUpAssert: function (idx) {
            [this.assertEdit[idx], this.assertEdit[idx - 1]] = [this.assertEdit[idx - 1], this.assertEdit[idx]]
        },
        indexDownAssert:  function (idx) {
            [this.assertEdit[idx], this.assertEdit[idx + 1]] = [this.assertEdit[idx + 1], this.assertEdit[idx]]
        },
        deleteAssert: function (idx) {
            this.assertEdit.splice(idx, 1)
        },
        indexUpHistory:  function (idx) {
            [this.portfolioEdit[idx], this.portfolioEdit[idx - 1]] = [this.portfolioEdit[idx - 1], this.portfolioEdit[idx]]
        },
        indexDownHistory:  function (idx) {
            [this.portfolioEdit[idx], this.portfolioEdit[idx + 1]] = [this.portfolioEdit[idx + 1], this.portfolioEdit[idx]]
        },
        deleteHistory: function (idx) {
            this.portfolioEdit.splice(idx, 1)
        },
        showEditModal: function () {
            this.portfolioEdit = JSON.parse(JSON.stringify(this.portfolio))
            this.assertEdit = JSON.parse(JSON.stringify(this.assert))

            this.editModal.show()
        },
        restoreConfig: function () {
            this.editValid = true
        },
        uploadConfig: function () {
            for (let el of this.portfolioEdit) {
                if ((el.date === '') ||
                    (el.us.cost === 0 ) || (el.us.value === 0) ||
                    (el.tw.cost === 0 ) || (el.tw.value === 0)) {
                    this.editValid = false
                    return
                }
            }

            for (let el of this.assertEdit) {
                if ((el.ticker === '') || (el.name === '' ) ||
                    (el.quantity === 0 ) || (el.cost === 0)) {
                    this.editValid = false
                    return
                }
            }

            this.portfolio = JSON.parse(JSON.stringify(this.portfolioEdit))
            this.assert = JSON.parse(JSON.stringify(this.assertEdit))

            this.editValid = true
            const config = {
                portfolio: this.portfolio,
                assert: this.assert,
            }

            axios.post('/config', config).then(async () => {
                this.editModal.hide()

                await this.refreshData()

                this.growthChart().destroy()
                this.drawdownChart().destroy()
                this.allocChart().destroy()
                this.returnChart().destroy()
                this.drawGrowthChart(this.portfolio)
                this.drawDrawdownChart(this.portfolio)
                this.drawAllocationChart(this.assert)
                this.drawReturnChart(this.portfolio)

                this.toggleCost()
                this.toggleTW()
                this.toggleUS()
            })
        },
        refreshData: async function () {
            this.refreshing = true
            this.twdusd = await this.getCurrency('TWD')

            let totalCost = 0
            let totalGain = 0
            let lastChange = 0
            for (let element of this.assert) {
                element.updated = true
                element.current = await this.getStock(element.ticker)
                element.last = await this.getLastChange(element.ticker)

                if (isNaN(parseInt(element.ticker))) {
                    totalCost += element.cost * this.twdusd
                    totalGain += element.current * element.quantity * this.twdusd
                    lastChange += (element.current - element.last) * element.quantity * this.twdusd
                } else {
                    totalCost += element.cost
                    totalGain += element.current * element.quantity
                    lastChange += (element.current - element.last) * element.quantity
                }
            }

            this.lastChangeUpdated = true
            this.totalGain = totalGain
            this.totalCost = totalCost
            this.lastChange = lastChange

            this.totalReturn = this.fixNum((this.totalGain - this.totalCost) / this.totalCost * 100)
            this.totalGainLoss = this.totalGain - this.totalCost
            this.totalCostLabel = this.fixNum(this.totalCost).toLocaleString('en-US', { style: 'currency', currency: 'TWD' })
            this.lastGain = this.fixNum(this.totalGain - this.lastChange).toLocaleString('en-US', { style: 'currency', currency: 'TWD' })
            this.totalGain = this.fixNum(this.totalGain).toLocaleString('en-US', { style: 'currency', currency: 'TWD' })

            this.refreshTime = new Date(Date.now()).toLocaleString()
            this.refreshing = false

            setTimeout(() => {
                this.lastChangeUpdated = false
                this.assert.forEach((el) => {
                    el.updated = false
                })
            }, 5000)
        },
        hexToRgba: function (hex, alpha = 1) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : 'rgba(0, u0, 0 ,1)'
        }
    },
    mounted: async function () {
        let res = await axios.get('/config')

        this.portfolio = res.data.portfolio
        this.assert = res.data.assert

        await this.refreshData()

        this.drawGrowthChart(this.portfolio)
        this.drawDrawdownChart(this.portfolio)
        this.drawAllocationChart(this.assert)
        this.drawReturnChart(this.portfolio)

        this.toggleCost()
        this.toggleTW()
        this.toggleUS()

        this.editModal = new bootstrap.Modal('#edit-modal')

        setInterval(() => {
            this.refreshData()
        }, 5 * 60 * 1000)   // every 5 minutes
    }
}
const appVm = Vue.createApp(app).mount('#app')

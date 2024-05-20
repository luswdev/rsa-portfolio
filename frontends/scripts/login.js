const app = {
    data() {
        return {
            username: '',
            password: '',
            loginFailed: false,
        }
    },
    methods: {
        doLogin: function () {
            let bodyFormData = new FormData()
            bodyFormData.append('username', this.username);
            bodyFormData.append('password', this.password);

            axios({
                method: 'post',
                url: 'https://fin.lusw.dev/login',
                data: bodyFormData,
                headers: { 'Content-Type': 'multipart/form-data' },
                credentials: 'include',
            }).then((resp) => {
                if (resp.data.status === 'success') {
                    window.location = '/'
                } else {
                    throw 'login failed'
                }
            }).catch(() => {
                this.loginFailed = true
                this.username = ''
                this.password = ''

                const alertPlaceholder = document.getElementById('login-alert')
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div class="alert alert-danger alert-dismissible" role="alert">`,
                    `   <div>Login failed, please try again.</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')

                alertPlaceholder.append(wrapper)

            })
        }
    }
}

const appVm = Vue.createApp(app).mount('#app')

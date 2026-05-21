document.addEventListener("DOMContentLoaded", function () {

    window.irParaPagina = function (pagina) {
        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = pagina;
        }, 350);
    };

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const btnLoginHeader = document.getElementById("btnLoginHeader");
    const btnSolicitacoes = document.getElementById("btnSolicitacoes");

    if (usuarioLogado && btnLoginHeader) {
        btnLoginHeader.textContent =
            "Olá, " + (usuarioLogado.nome || usuarioLogado.email) + " | Sair";

        btnLoginHeader.removeAttribute("href");

        btnLoginHeader.onclick = function (e) {
            e.preventDefault();

            const sair = confirm("Deseja sair da conta?");

            if (sair) {
                localStorage.removeItem("usuarioLogado");
                localStorage.removeItem("ultimaSolicitacao");
                window.location.reload();
            }
        };
    }

    if (usuarioLogado && btnSolicitacoes) {
        btnSolicitacoes.classList.remove("hidden");
    }

    const navMobile = document.querySelector(".nav-mobile");
    const menuIcon = document.querySelector(".menu-icon");
    const closeIcon = document.querySelector(".close-icon");

    window.toggleMenu = function () {
        if (navMobile) navMobile.classList.toggle("hidden");
        if (menuIcon) menuIcon.classList.toggle("hidden");
        if (closeIcon) closeIcon.classList.toggle("hidden");
    };

    window.scrollToSection = function (id) {
        const section = document.getElementById(id);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth"
            });
        }

        if (navMobile && !navMobile.classList.contains("hidden")) {
            toggleMenu();
        }
    };

    const planoSalvo = localStorage.getItem("planoEscolhido");
    const selectPlano = document.getElementById("plan");

    if (planoSalvo && selectPlano) {
        selectPlano.value = planoSalvo;
    }

    const inputTelefone = document.getElementById("phone");

    if (inputTelefone) {
        inputTelefone.addEventListener("input", function () {
            let valor = inputTelefone.value.replace(/\D/g, "");

            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }

            if (valor.length <= 10) {
                valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
            } else {
                valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
            }

            inputTelefone.value = valor;
        });
    }

    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validarTelefone(telefone) {
        const apenasNumeros = telefone.replace(/\D/g, "");
        return apenasNumeros.length === 10 || apenasNumeros.length === 11;
    }

    function validarNome(nome) {
        return /^[A-Za-zÀ-ÿ\s]{3,100}$/.test(nome);
    }

    const form = document.getElementById("contactForm");
    const successMessage = document.getElementById("successMessage");
    const formMessage = document.getElementById("formMessage");

    function mostrarMensagem(texto, tipo) {
        if (!formMessage) return;

        formMessage.textContent = texto;

        formMessage.classList.remove("hidden", "error", "success");
        formMessage.classList.add(tipo);

        setTimeout(() => {
            formMessage.classList.add("hidden");
        }, 4000);
    }

    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const nome = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const telefone = document.getElementById("phone").value.trim();
            const plano = document.getElementById("plan").value;
            const mensagem = document.getElementById("message").value.trim();

            if (!validarNome(nome)) {
                mostrarMensagem("Digite um nome válido com pelo menos 3 letras.", "error");
                return;
            }

            if (!validarEmail(email)) {
                mostrarMensagem("Digite um e-mail válido.", "error");
                return;
            }

            if (!validarTelefone(telefone)) {
                mostrarMensagem("Digite um telefone válido com DDD.", "error");
                return;
            }

            if (!plano) {
                mostrarMensagem("Selecione um plano de interesse.", "error");
                return;
            }

            if (mensagem.length > 300) {
                mostrarMensagem("A mensagem deve ter no máximo 300 caracteres.", "error");
                return;
            }

            const dados = {
                nome: nome,
                email: email,
                telefone: telefone,
                plano: plano,
                mensagem: mensagem
            };

            try {
                const resposta = await fetch("http://localhost:5069/api/contatos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });

                if (!resposta.ok) {
                    throw new Error("Erro ao enviar formulário.");
                }

                localStorage.setItem("ultimaSolicitacao", JSON.stringify(dados));
                localStorage.removeItem("planoEscolhido");

                mostrarMensagem("Mensagem enviada com sucesso!", "success");

                setTimeout(() => {
                    form.reset();
                    form.classList.add("hidden");

                    if (successMessage) {
                        successMessage.classList.remove("hidden");
                    }
                }, 800);

            } catch (error) {
                console.error(error);
                mostrarMensagem("Erro ao enviar formulário. Verifique se a API está rodando.", "error");
            }
        });
    }

});
// DISCLAIMER: Fiz isso um pouco correndo, para já deixar pronto
// antes de uma aula, e sem ter prática; reconheço que ainda não
// está da forma ideal (ver TODOs), mas já é melhor que colocar 
// try... catch em todos os métodos das classes controladoras, ou 
// que não tratar
function ErrorHandler(error, request, response, next) {
    // TODO: tratar mais tipos de erros
    // TODO: criar classes p/ os tipos?
    // https://javascript.info/custom-errors
    // (ao menos não ter as strings hardcoded já ajudaria...)
    console.log("The error handling middleware has caught the" +
        " following error:");

    if (error.stack) { console.log(error.stack); }

    // nem sempre está disponível
    else { console.log(error.name + ": " + error.message); }
    // (o stack trace já começa com essa linha)
    // Respostas a tipos específicos de erros:
    if (error.message === "Not found") {
        return response.status(404).json({ message: error.message });
    }

    if (error.name === "CastError") {
        return response.status(404).json({ message: "Invalid ID" });
    }

    if (error.name === "ValidationError" ||
        error.message === "Sorry, this link had expired") {
        return response.status(403).json({ message: error.message });
        // Qual seria o código de erro mais adequado aqui?
    }

    if (error.message === "Unauthorized") {
        return response.status(401).json({ message: error.message });
    }

    // Resposta genérica (o default do switch):
    response.status(500).json({ message: "Unexpected error" });
}

export default ErrorHandler;
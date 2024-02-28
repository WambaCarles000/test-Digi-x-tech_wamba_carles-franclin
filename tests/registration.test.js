const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../votre_fichier_principal_app.js'); // Remplacez "votre_fichier_principal_app.js" par le nom de votre fichier principal où se trouve l'application
const expect = chai.expect;

chai.use(chaiHttp);

describe('Register Route', () => {
    it('should register successfully with valid credentials', (done) => {
        chai.request(app)
            .post('/register')
            .send({ username: 'testuser', email: 'testuser@example.com', password: 'testpassword' }) // Remplacez par des informations de compte valides
            .end((err, res) => {
                expect(res).to.have.status(302); // Nous nous attendons à une redirection (302) vers la page d'accueil
                expect(res.redirects[0]).to.include('/index.html');
                expect(res.redirects[0]).to.include('username=testuser');
                expect(res.redirects[0]).to.include('email=testuser@example.com');
                done();
            });
    });

    it('should return 409 conflict error if user already exists', (done) => {
        chai.request(app)
            .post('/register')
            .send({ username: 'existinguser', email: 'existinguser@example.com', password: 'existingpassword' }) // Remplacez par des informations de compte déjà existantes dans la base de données
            .end((err, res) => {
                expect(res).to.have.status(409);
                expect(res.text).to.include('409 error : User already exists');
                done();
            });
    });
});

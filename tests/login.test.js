const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../votre_fichier_principal_app.js'); // Remplacez "votre_fichier_principal_app.js" par le nom de votre fichier principal où se trouve l'application
const expect = chai.expect;

chai.use(chaiHttp);

describe('Login Route', () => {
    it('should login successfully with correct credentials', (done) => {
        chai.request(app)
            .post('/login')
            .send({ email: 'testuser@example.com', password: 'testpassword' }) // Remplacez 'testuser@example.com' et 'testpassword' par des informations de connexion valides dans votre base de données
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.redirects[0]).to.include('/index.html');
                expect(res.redirects[0]).to.include('username=testuser');
                expect(res.redirects[0]).to.include('email=testuser@example.com');
                done();
            });
    });

    it('should return 401 unauthorized with incorrect email', (done) => {
        chai.request(app)
            .post('/login')
            .send({ email: 'nonexistentuser@example.com', password: 'testpassword' }) // Remplacez 'nonexistentuser@example.com' par un e-mail qui n'existe pas dans votre base de données
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.text).to.include('Unauthorized');
                done();
            });
    });

    it('should return 401 unauthorized with incorrect password', (done) => {
        chai.request(app)
            .post('/login')
            .send({ email: 'testuser@example.com', password: 'incorrectpassword' }) // Remplacez 'incorrectpassword' par un mot de passe incorrect pour l'utilisateur spécifié
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.text).to.include('Unauthorized');
                done();
            });
    });
});

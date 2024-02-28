
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const path = require('path');
const  {  User, } = require("../models/models");




// FONCTION DE GENERATION DE LA CHAINE ALEATOIRE 

function generateUniqueToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');

}

// fonction qui envoie le mail de confirmation
async function sendConfirmationEmail(user) {

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4ef3fad278252d",
      pass: "ac931c0d45b8dd"
    }
  });

  const confirmationLink = `http://localhost:5000/auth/confirm?token=${user.confirmationToken}`;

  const mailOptions = {
    from: 'shadowgroup',
    to: user.email,
    subject: 'Confirmation d\'inscription',
    text: `Cliquez sur le lien suivant pour confirmer votre inscription : ${confirmationLink}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail de confirmation envoyé :', info.response);

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error);
  }
}


// Fonction pour envoyer l'email de réinitialisation de mot de passe
async function sendResetPasswordEmail(user) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4ef3fad278252d",
      pass: "ac931c0d45b8dd"
    }
  });

  const resetLink = `http://localhost:5000/auth/reset-password?token=${user.resetPasswordToken}`;

  const mailOptions = {
    from: 'shadowgroup',
    to: user.email,
    subject: 'Réinitialisation de mot de passe',
    text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de réinitialisation de mot de passe envoyé :', info.response);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation de mot de passe :', error);
  }
}

// confirm user
module.exports.confirmUser = async(req, res)=> {
  
  const { token } = req.query;

  console.log('token recupere');

  try {
    const user = await User.findOne({ confirmationToken: token });

    if (user) {


      console.log('Utilisateur trouvé :', user);

      user.isAuthenticated = true;
      await user.save();

      
      console.log('Utilisateur après la mise à jour :', user);
      return res.send('Inscription confirmée !');
    } else {
      return res.status(404).send('Token invalide.');
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation de l\'utilisateur :', error);
    return res.status(500).send('Erreur lors de la confirmation de l\'utilisateur.');
  }
};


//LOGIN FORM

module.exports.loginForm = async(req,res)=> {

  res.sendFile(path.join(__dirname, 'public', 'login.html'));

 
 
};





//LOGIN

module.exports.login = async(req,res)=> {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).sendFile(path.join(__dirname, 'public', 'error.html'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).sendFile(path.join(__dirname, 'public', 'error.html')); 
    }

    // Stockage du nom d'utilisateur dans un cookie sécurisé
    res.cookie('username', user.username, { httpOnly: true, secure: true });
    res.redirect(`/index.html?username=${user.username}&email=${user.email}`);

    res.status(200).sendFile(path.join(__dirname, 'public', 'success.html'));
} catch (error) {
    res.status(500).sendFile(path.join(__dirname, 'public', 'error.html'));
}
 
};

















//REGISTRATION
module.exports.register = async (req, res) => {



  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.status(409).send('409 error : User already exists' );
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = generateUniqueToken();

    const newUser = new User({ username, email, password: hashedPassword, confirmationToken });
    await newUser.save();

    // Enregistrement de l'ID de l'utilisateur dans la session
    req.session.userId = newUser._id;
    console.log(req.session.userId);
    
    // Envoi du mail de confirmation
    await sendConfirmationEmail(newUser);
    
    // Sauvegarde de la session
    req.session.save();
   // REDIRECTION VERS LA PAGE D'ACCEUIL
    res.redirect(`/index.html?username=${newUser.username}&email=${newUser.email}`);
    // res.status(201).sendFile(path.join(__dirname, 'public', 'success.html'));
    
  } catch (error) {
    res.status(500).send('internal error: ' + error.message);
  }


}




// Route pour le formulaire "Mot de passe oublié"

module.exports.forgotPasswordForm = async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'forgot-password.html'));

}





// controleur pour la gestion du formulaire de gestion du mot passe oublie
module.exports.forgotPassword = async (req, res) => {


  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).send('Utilisateur non trouvé');
    }

    const resetToken = generateUniqueToken(); // Générer un token unique
    user.resetPasswordToken = resetToken; // Stocker le token dans la base de données
    user.resetPasswordExpires = Date.now() + 3600000; // Durée de validité du token : 1 heure
    await user.save(); // Sauvegarder les modifications dans la base de données

    await sendResetPasswordEmail(user); // Envoyer l'email de réinitialisation

    res.status(200).sendFile(path.join(__dirname, 'public', 'forgot-password-success.html'));
} catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', error);
    res.status(500).send('Erreur lors de la réinitialisation du mot de passe');
}

 }







// Contrôleur pour la réinitialisation de mot de passe
module.exports.resetPassword =  async (req, res) => {
  try {
      const { token, password, confirmPassword } = req.body;
      const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

      if (!user) {
          return res.status(400).send('Token de réinitialisation de mot de passe invalide ou expiré');
      }

      if (password !== confirmPassword) {
          return res.status(400).send('Les mots de passe ne correspondent pas');
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).send('Mot de passe réinitialisé avec succès');
  } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe :', error);
      res.status(500).send('Erreur lors de la réinitialisation du mot de passe');
  }
};

//Updating of user's datas

module.exports.updateInfo = async (req, res) => {
  const getUserIdFromSession = (req) => {
      return req.session.userId;
  };

  try {
      const { newUsername, newUsermail } = req.body;
      const userId = getUserIdFromSession(req);

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send('Utilisateur non trouvé');
      }

      // Mise à jour des données de l'utilisateur
      if (newUsername) {
          user.username = newUsername;
      }
      if (newUsermail) {
          user.email = newUsermail;
      }

      // Enregistrement des modifications dans la base de données
      await user.save();
 
      // Renvoyer les nouvelles données de l'utilisateur
      res.redirect(`/index.html?username=${user.username}&email=${user.email}`);

      // res.status(200).json({ username: user.username, email: user.email });
  } catch (error) {
      console.error('Erreur lors de la mise à jour des informations de l\'utilisateur :', error);
      res.status(500).send('Erreur lors de la mise à jour des informations de l\'utilisateur');
  }
};

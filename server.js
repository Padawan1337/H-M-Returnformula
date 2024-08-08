const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const upload = multer();

const app = express();
const port = process.env.PORT || 3000;

// Indtast din SendGrid API nøgle her
sgMail.setApiKey('DIN_SENDGRID_API_NØGLE');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-reklamation', upload.array('billeder'), (req, res) => {
    const { email, navn, gadeNummer, postnummerBy, mobilnummer, salgordrenummer, produktKategori, varenummer, modtagelsesdato, emne, beskrivelse } = req.body;

    const msg = {
        to: 'modtager@eksempel.com',
        from: email,
        subject: 'Ny Reklamation',
        text: `
            Navn: ${navn}
            Email: ${email}
            Adresse: ${gadeNummer}, ${postnummerBy}
            Mobilnummer: ${mobilnummer}
            Salgordrenummer: ${salgordrenummer}
            Produktkategori: ${produktKategori}
            Varenummer: ${varenummer}
            Modtagelsesdato: ${modtagelsesdato}
            Emne: ${emne}
            Beskrivelse: ${beskrivelse}
        `,
    };

    sgMail
        .send(msg)
        .then(() => {
            res.json({ message: 'Reklamationen er sendt. Du vil modtage en kvittering på email.' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Der opstod en fejl ved afsendelse af reklamationen.' });
        });
});

app.listen(port, () => {
    console.log(`Serveren kører på port ${port}`);
});

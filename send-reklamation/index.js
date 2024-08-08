const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();
const port = process.env.PORT || 3000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send-reklamation', (req, res) => {
    const { email, navn, gadeNummer, postnummerBy, mobilnummer, salgordrenummer, produktKategori, varenummer, modtagelsesdato, emne, beskrivelse } = req.body;

    const msg = {
        to: 'it@sofacompany.com',
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

module.exports = app;

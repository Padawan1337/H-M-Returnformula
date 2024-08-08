const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function (context, req) {
    context.res = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Tillad alle domæner - ændre dette til specifikke domæner hvis nødvendigt
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    };

    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

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

    try {
        await sgMail.send(msg);
        context.res.status = 200;
        context.res.body = { message: 'Reklamationen er sendt. Du vil modtage en kvittering på email.' };
    } catch (error) {
        context.log.error('Fejl:', error);
        context.res.status = 500;
        context.res.body = { error: 'Der opstod en fejl ved afsendelse af reklamationen.' };
    }
};

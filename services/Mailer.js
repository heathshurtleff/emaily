const keys = require('../config/keys');
const SibApiV3Sdk = require('sib-api-v3-sdk');

class Mailer {
    constructor({ id }, { subject, recipients }, content) {
        this.defaultClient = SibApiV3Sdk.ApiClient.instance;
        this.apiKey = this.defaultClient.authentications['api-key'];
        this.apiKey.apiKey = keys.sendInBlueKey;
        this.userId = id;
        this.subject = subject;
        this.content = content;
        this.recipients = recipients;
        this.contactsAPI = new SibApiV3Sdk.ContactsApi();
        this.emailCampaignApi = new SibApiV3Sdk.EmailCampaignsApi();
    }

    createNewList = () => {
        let newList = new SibApiV3Sdk.CreateList();
        newList.name = `${this.userId}-${Date.now()}`;
        newList.folderId = keys.sendInBlueParentFolderId;
        return this.contactsAPI.createList(newList);
    }

    addContactsToList = (listId, recipients) => {
        recipients.forEach(async ({ email }) => {
            const contact = new SibApiV3Sdk.CreateContact();
            contact.email = email;
            contact.listIds = [listId];
            contact.updateEnabled = true;

            await this.contactsAPI.createContact(contact);
        });
        // let newContacts = new SibApiV3Sdk.AddContactToList();
        // newContacts.emails = recipients.map(({ email }) => email);
        // return this.contactsAPI.addContactToList(listId, newContacts);
    }

    createEmailCampaign = (subject, listId, content) => {
        let emailCampaign = new SibApiV3Sdk.CreateEmailCampaign();
        emailCampaign = {
            tag: 'survey',
            sender: { name: 'Heath Shurtleff', email: 'h2shurtleff@gmail.com' },
            name: 'Emaily Survey',
            subject,
            htmlContent: content,
            recipients: { listIds: [listId] },
            utmCampaign: `${this.userId}Survey`
        };
        return this.emailCampaignApi.createEmailCampaign(emailCampaign);
    }

    initializeEmail = async () => {
        const newListData = await this.createNewList();
        await this.addContactsToList(newListData.id, this.recipients);

        const campaignData = await this.createEmailCampaign(this.subject, newListData.id, this.content);
        const campaignSent = await this.emailCampaignApi.sendEmailCampaignNow(campaignData.id);
        return campaignSent;
    }
}

module.exports = Mailer;
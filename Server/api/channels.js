// This API handle Query channel, messages handle (socket,...) 
// Import Packages
import { v4 as uuidv4 } from 'uuid';

// Import API

// Import Util
import{CreateChannel, CreateMessage} from '../util/creator';
import {QueryChannels, QueryChannelparticular, QueryMessages, QueryAccountPK} from '../util/query';
import { Transfer } from '../util/transfer';

const channels = async (server, bodyParser, io) => {
    // Get the list of channel when click to team button
    server.get('/:user/:team', async (req, res) => {
        const {user, team} = req.params;
        let channels = await QueryChannels(team);
        if (channels != false) {
            return res.json(channels);
        } else {
            return res.json('SERVER ERROR: Channels?');
        }
    });

    server.post('/:user/:team', async (req, res) => {
        const {user, team} = req.params;
        const {type_, title} = req.body;
        const UUIDV4 = uuidv4();
        let title_ = title+'-*khmluerl*-'+UUIDV4;
        try {
            let user_id = await QueryAccountPK(user);
            let create_channel = await CreateChannel(type_, user_id, team, title_);
            if (create_channel) {  
                await Transfer(team, {channel: true});
                return res.json('Create channel successully!');
            } else {
                await Transfer(team, {channel: false});
                return res.json('Cannot create channel?');
            }
        } catch (error) {
            return res.json('Server error');
        }
    });

    // This return channel particular
    server.get('/:user/:team/:channel', async (req, res) => {
        const {user, team, channel} = req.params;
        let channelparticular = await QueryChannelparticular(channel);
        return res.json(channelparticular);
    });

    // Handle messages:
    server.get('/:user/:team/:channel/t', async (req, res) => {
        const {user, team, channel} = req.params;
        try {
            let querymsg = await QueryMessages(channel);
            return res.json(querymsg);
        } catch (error) {
            console.log(error);
            return res.json(false);
        }
    });

    server.post('/:user/:team/:channel/t', async (req, res) => {
        const {user, team, channel} = req.params;
        const {message_att, message, contact_id, att_id} = req.body;
        console.log(req.body);
        try {
            // From now, the flow will be devided to two: DATABASE and SOCKET
            await CreateMessage(message_att, message, user, contact_id, att_id, channel);
            await Transfer(channel, {username: user, message: message, channel: channel});
            return res.json(true);
        } catch (error) {
            console.log(error);
            return res.json(false);
        }
    });
}

export default channels;
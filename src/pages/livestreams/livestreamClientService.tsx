import IVSBroadcastClient, {
    Errors,
    BASIC_LANDSCAPE
} from 'amazon-ivs-web-broadcast';

const ivsService = () => {



    const client = IVSBroadcastClient.create({
        // Enter the desired stream configuration
        streamConfig: IVSBroadcastClient.BASIC_LANDSCAPE,
        // Enter the ingest endpoint from the AWS console or CreateChannel API
        ingestEndpoint: 'rtmps://a79082e7f75f.global-contribute.live-video.net:443/app/',
    });

    client
        .startBroadcast('sk_eu-central-1_BZIfWbHAm0ix_wSAm5WT0abOdapCJYuMHnetKOws8Jt')
        .then((result) => {
            console.log('I am successfully broadcasting!');
        })
        .catch((error) => {
            console.error('Something drastically failed while broadcasting!', error);
        });
    return { client }
}
export default ivsService;
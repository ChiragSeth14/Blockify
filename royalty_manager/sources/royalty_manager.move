module royalty_manager::royalty_manager {

    use std::string;
    use sui::balance;
    use sui::coin;
    use sui::sui::SUI;

    public struct MusicTrack has key {
        id: UID,
        track_id: u64,
        owner: address,
        title: string::String,
        artist: string::String,
        value: u64,
        royalties: u64,
        balance: balance::Balance<SUI>
    }

    public fun new(track_id: u64, owner: address, title: string::String, artist: string::String, value: u64, royalties: u64, ctx: &mut TxContext): MusicTrack {
        MusicTrack {
            id: object::new(ctx),
            track_id,
            owner,
            title,
            artist,
            value,
            royalties,
            balance: balance::zero()
        }
    }

    public entry fun create_new_track(track_id: u64, owner: address, title: string::String, artist: string::String, value: u64, royalties: u64, ctx: &mut TxContext) {
        let track = new(track_id, owner, title, artist, value, royalties, ctx);
        transfer::transfer(track, tx_context::sender(ctx));
    }

    public entry fun transfer(track: MusicTrack, recipient: address) {
        transfer::transfer(track, recipient);
    }

    public fun play_track(track: &mut MusicTrack, payment_coin:coin::Coin<SUI>) {
        track.value = track.value + 1;
        track.balance.join(payment_coin.into_balance());


        //distribute_royalties(track);
    }

    public entry fun distribute_royalties(track: &mut MusicTrack) {
        let royalty_percentage = 80 * 1000;
        let streaming_rate = 4 * 1000;
        track.royalties = track.royalties + ((streaming_rate * royalty_percentage) / (100 * 1000));
    }
}
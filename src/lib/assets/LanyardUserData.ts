export default interface LanyardUserData {
  kv: Record<string, unknown>;
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    clan: null | unknown;
    primary_guild: {
      tag: string;
      identity_guild_id: string;
      badge: string;
      identity_enabled: boolean;
    };
    avatar_decoration_data: {
      sku_id: string;
      asset: string;
      expires_at: null | string;
    };
    collectibles: {
      nameplate: {
        label: string;
        sku_id: string;
        asset: string;
        expires_at: null | string;
        palette: string;
      };
    };
    bot: boolean;
    global_name: string;
    display_name: string;
    public_flags: number;
    display_name_styles: null | unknown;
  };
  activities: Array<{
    id: string;
    name: string;
    type: number;
    state?: string;
    session_id: string;
    created_at: number;
    details?: string;
    application_id?: string;
    timestamps?: {
      start?: number;
      end?: number;
    };
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
    buttons?: string[];
    platform?: string;
  }>;
  discord_status: string;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_embedded: boolean;
  listening_to_spotify: boolean;
  spotify: null | unknown;
}
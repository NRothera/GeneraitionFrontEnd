export class StableDiffusionModel {
    prompt: string = "";
    // negative_prompt: string = "(worst quality, low quality:1.4), watermark, signature, shadows";
    negative_prompt: string = "";
    styles: string[] = ["string"];
    seed: number = -1;
    subseed: number = -1;
    // subseed_strength: number = 0;
    // seed_resize_from_h: number = -1;
    // seed_resize_from_w: number = -1;
    sampler_name: string = "Euler a";
    scheduler: string = "Automatic";
    batch_size: number = 1;
    n_iter: number = 1;
    steps: number = 24;
    cfg_scale: number = 8;
    width: number = 700;
    height: number = 700;
    // restore_faces: boolean = false;
    // tiling: boolean = false;
    // do_not_save_samples: boolean = false;
    // do_not_save_grid: boolean = false;
    // eta: number = 0;
    denoising_strength: number = 0.7;
    // s_min_uncond: number = 0;
    // s_churn: number = 0;
    // s_tmax: number = 0;
    // s_tmin: number = 0;
    s_noise: number = 1;
    override_settings: Record<string, unknown> = {};
    override_settings_restore_afterwards: boolean = true;
    // refiner_checkpoint: string = "";
    // refiner_switch_at: number = 0;
    // disable_extra_networks: boolean = false;
    // firstpass_image: string = "";
    // comments: Record<string, unknown> = {};
    // enable_hr: boolean = false;
    // firstphase_width: number = 0;
    // firstphase_height: number = 0;
    hr_scale: number = 2;
    hr_upscaler: string = "latent";
    // hr_second_pass_steps: number = 0;
    // hr_resize_x: number = 0;
    // hr_resize_y: number = 0;
    // hr_checkpoint_name: string = "";
    // hr_sampler_name: string = "";
    // hr_scheduler: string = "";
    // hr_prompt: string = "";
    // hr_negative_prompt: string = "";
    // force_task_id: string = "";
    // sampler_index: string = "Euler a";
    // script_name: string = "";
    // script_args: string[] = [];
    send_images: boolean = true;
    save_images: boolean = true;
    // alwayson_scripts: Record<string, unknown> = {};
  
    constructor(init?: Partial<StableDiffusionModel>) 
    {
      Object.assign(this, init);
    }
  }
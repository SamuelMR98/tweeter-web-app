import { FollowService } from "../model/service/FollowService";

interface FolloweeView {
    
}

export class FolloweePresenter {
    private followService: FollowService;
    private view: FolloweeView;

    public constructor(view: FolloweeView) {
        this.followService = new FollowService();
        this.view = view;
    }
}
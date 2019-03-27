import { Controller } from 'egg';

export default class HomeController extends Controller {
    public async index() {
        const { ctx } = this;
        await ctx.render('index.html');
    }

    public async login() {
        const { ctx } = this;
        await ctx.render('login.html');
    }
}

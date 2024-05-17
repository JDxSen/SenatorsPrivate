import discord
from discord.ext import commands
from discord_slash import SlashCommand, SlashContext

bot = commands.Bot(command_prefix="!")
slash = SlashCommand(bot, sync_commands=True)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}!')

@slash.slash(name="ping", description="Ping command")
async def _ping(ctx: SlashContext):
    await ctx.send(f"Pong! {round(bot.latency * 1000)}ms")

bot.run('MTI0MDA3MzM3NTk4OTIzOTgyOA.G4E4E-.YxR4sWBvKa30TExUPQOOkGthdRIW9K0QgIZbUY')
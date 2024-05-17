import discord
from discord.ext import commands
from discord_slash import SlashCommand, SlashContext

bot = commands.Bot(command_prefix='/', intents=discord.Intents.default())
slash = SlashCommand(bot, sync_commands=True)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user.name}')

@bot.event
async def on_voice_state_update(member, before, after):
    if after.channel is not None:
        if not hasattr(member, 'voice_join_time'):
            member.voice_join_time = discord.utils.utcnow()
    elif before.channel is not None:
        if hasattr(member, 'voice_join_time'):
            time_spent = discord.utils.utcnow() - member.voice_join_time
            print(f'{member.display_name} spent {time_spent} in voice channel')

@slash.slash(name="setup", description="Setup the voice channel leaderboard")
async def setup(ctx: SlashContext):
    embed = discord.Embed(title="Voice Channel Leaderboard", description="Top 10 users by time spent in voice channels", color=0x00ff00)
    voice_times = {}
    for member in ctx.guild.members:
        if hasattr(member, 'voice_join_time'):
            time_spent = discord.utils.utcnow() - member.voice_join_time
            voice_times[member.display_name] = time_spent
    sorted_voice_times = sorted(voice_times.items(), key=lambda x: x[1], reverse=True)[:10]
    for i, (username, time_spent) in enumerate(sorted_voice_times):
        embed.add_field(name=f"{i+1}. {username}", value=f"Time spent: {time_spent}", inline=False)
    await ctx.send(embed=embed)

bot.run('MTI0MDA3MzM3NTk4OTIzOTgyOA.G4E4E-.YxR4sWBvKa30TExUPQOOkGthdRIW9K0QgIZbUY')

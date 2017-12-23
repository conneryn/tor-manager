# What is this? #

This is a fairly simple tool to help manage and maintain multiple tor relays on one server.
It's not really meant for others to use, so use at your own risk.

# Why multiple tor nodes on the same server? #

The main motivation for this is to make full use of all the cors on each server.  This makes 
it easy to add/remove multiple "instances" of tor, listening on different ports or IP addresses.

It also helps with keeping the MyFamily synchronized, and automatically populates exit policy and
TorNull rules if needed.  Abuses seem to run in spurts, so it's nice to have an easy mechanism to
switch the exit policy without any hassle.  I simply switch to a reduced policy if complaints are
high, then a few days later, switch back to a fairly open policy.
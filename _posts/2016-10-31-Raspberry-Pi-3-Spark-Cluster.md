---
layout: post
title: "Creating a spark cluster with multiple raspberry pis"
description: "A ton of text to test readability."
tags: [data science,spark,raspberry pi]
categories: [data science]
---

In this post I will go through the hardware and setup steps I went through to create a 2-node raspberry pi spark cluster. I'm using two brand-new raspberry pi 3 which, while not making this a very powerful spark cluster, should hopefully still give me some hardware to power some of my future Spark and Spark streaming projects. The Pi 3 has a quad-core 1.2GHz processor with 1G of RAM, a Broadcom VideoCore IV GPU making it a nice low-cost system for some first experimentations with spark. The GPU promises some interesting future experiments with distributed GPU deep learning, but I'm getting ahead of myself.

<!-- more -->

Apache Spark is a fast-growing open-source framework for distributed computing that has a lot of promise for the world of data science and I really wanted a project that would allow me to play around with Spark, and the libraries that it includes. Spark, at it's core is an engine for running computations on distributed datasets using Resilient Distributed Datasets (RDDs). It was developped to overcome limitations to the MapReduce framework, in which intermediate results of reduce operations have to be written to disk before being used again. The RDD allows Spark to keep intermediate results in memory in a distributed and fault-tolerant way. This means that certain computations can be run two orders of magnitude faster with Spark compared with MapReduce.

There are already a few blog posts out there detailing how to install spark on raspberry pi and setting up a cluster, however none of them (as far as I could find on first pass) talk about Spark 2.0 which is still fairly new at the time of writing and none use the raspi 3.

# Ingredients

First of all, here's a few things you'll need to buy to set up a similar cluster. 

* Two or more Raspberry Pi 3
* A usb power hub and usb to micro-usb cables (make sure the current rating is higher than 2A to power the pi)
* As many ethernet cables as you have raspi nodes
* One Gigabit Ethernet switch for the local cluster network
* Some class-10 speed micro-SD cards. I went for 32GB which should be plenty for my experiments

# Setting up spark on a single raspi

First of all, download your favorite linux distribution for raspberry pi (I used raspian) and create images on each SD card.

## Set up ssh access to your raspi

It's a good idea to first set up ssh connection to your Pis, to make it easier to work on them without having to worry about connection monitors/keyboard whenever we need to switch pi.

First open a terminal and type:
{% highlight css %}
sudo raspi-config
{% endhighlight %}
Then enable ssh server. Another benefit of the raspi 3 is the onboard wifi card so you can connect your pis to your wifi network out of the box. Connect them to your ethernet switch too. Typing `ifconfig` will display the current IP address on the wifi network (wlan0) and ethernet local network (eth0). Note these down, as they'll serve as the static IPs that we'll define later.
It's also a good idea to change the default password as soon as possible. If you want to ssh into your Pis with a linux machine, it should now be as simple as `ssh pi@[insert wlan0 IP here]` and inputting your new password.

Next we'll want to set the IPs as static by modifying the `/etc/network/interfaces` files on your Pis. Replace the lines that look like `iface wlan0 inet manual` with the following:
{% highlight css %}
iface wlan0 inet static
    address [insert wlan0 IP]
iface eth0 inet static
    address [insert eth0 IP]
{% endhighlight %}

## download spark binary

The easiest way to install Spark is to download the spark binary and uncompress it. Look for the link to the latest version [here](http://spark.apache.org/downloads.html), and copy the direct download URL then run on your raspi:
{% highlight css %}
wget [insert URL]
tar -zxvf [downloaded .tgz file]
{% endhighlight %}
Copy the newly created folder wherever you prefer (I copied mine to /opt/spark), and add the /bin folder to the PATH environment variable (e.g. by adding `export PATH=$PATH:/path/to/spark/bin` to your ~/.bashrc file). You should now be able to type `spark-shell` in a terminal and get access to the spark shell with a spark context.

To run a spark cluster, it's a good idea to set up a user account on all Pis dedicated for spark use with `sudo adduser spark`

# setting up the cluster

Now that spark is up and running on all the nodes, now is time to define master and slave nodes and get spark to manage a truly distributed cluster.

In your spark directory, you should have a template shell script to define your spark environment called `spark-env.sh.template`. For each Pi, copy this to a new `spark-env.sh` file and add the following to the end:
{% highlight css %}
SPARK_MASTER_HOST=[eth0 IP of your master node]
SPARK_WORKER_MEMORY=768m
SPARK_LOCAL_IP=[eth0 IP the node]
{% endhighlight %}

Assuming you set up a new user called spark on each Pi, add the following to the slaves file:
{% highlight css %}
spark@[eth0 IP of the slave node]
{% endhighlight %}
If you have more than one slave, add them all to this file and propagate these changes to all the nodes

Once this is done, you should be able to run the start-master.sh and start-slaves.sh shell scripts from the master node, and if the configuration is set correctly, we can start a spark-shell or submit a job to spark using the master and slaves as executors. To start a spark shell using the cluster, check the master URL at the UI at port 8080, and run the following:
{% highlight css %}
spark-shell --master spark://[master_ip]:7077
{% endhighlight %}
This should now be an interactive spark shell running on the raspberry pi cluster!
Make sure to check the logs that are created when running start-master.sh and start-slaves.sh to make no errors were raised. You should also be able to check the web UI generated at port 8080 and the UI at port 4040 when calling spark-shell to check that there are the correct number of executors, and that they are alive and well.

[insert image of cluster in all its glory]

That should cover the steps I followed when creating my cluster. I wrote this post a while after I set the cluster up, so I may have forgotten a couple of steps, but I'll add them to the post as they come back to me.

#Other Resources

Here are a few links to resources that were extremely useful when going through this process myself.

[https://darrenjw2.wordpress.com/2015/04/17/installing-apache-spark-on-a-raspberry-pi-2/](https://darrenjw2.wordpress.com/2015/04/17/installing-apache-spark-on-a-raspberry-pi-2/)

[http://bailiwick.io/2015/07/07/create-your-own-apache-spark-cluster-using-raspberry-pi-2/](http://bailiwick.io/2015/07/07/create-your-own-apache-spark-cluster-using-raspberry-pi-2/)
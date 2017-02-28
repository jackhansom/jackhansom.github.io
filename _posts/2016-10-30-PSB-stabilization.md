---
layout: post
title: "One week of French election tweets"
description: "A ton of text to test readability."
tags: [data science, election]
categories: [data science]
jsarr:
- graphs/test_graph.js
---

This is a quick showcase of some data I collected for one week during the French presidential primaries for the republicans

## Some Spark code for the tweet streaming

## Some Scala code for the network creation

First define nodes, edges and weighted edges as case clases:

{% highlight scala %}

// tweet hashtags are just a list of hashtag strings
type TweetHashtags = List[String]

// A node is an object with a label and a weight
// Two nodes with the same label are the same
case class Node(label: String, weight: Int) {
    def ==(that: Node): Boolean = this.label == that.label
}

// An edge is an object with a source node and a target node
case class Edge(source: Node, target: Node) extends Ordered[Edge] {
    def sorted = if (this.source.label < this.target.label) Edge(source, target) else Edge(target, source)

    def compare(that: Edge) = this.source.label compare that.source.label

    // an edge from A -> B is the same as an edge from B -> A 
    def ==(that: Edge): Boolean = (
        ((this.source.label == that.source.label)&&(this.target.label == that.target.label))
        ||((this.source.label == that.target.label)&&(this.target.label == that.source.label))
      )
}

// A weighted edge is similar but also has an int weight on its edge
case class WeightedEdge(source: Node, target: Node, weight: Int) extends Ordered[WeightedEdge] {
    def sorted = if (this.source.label < this.target.label) Edge(source, target) else Edge(target, source)

    def compare(that: WeightedEdge) = this.weight compare that.weight

    def ==(that: Edge): Boolean = (
        (this.source == that.source)&&(this.target == that.target))
        ||((this.source == that.target)&&(this.target == that.source))
}

{% endhighlight %}

Bunch of functions to create a network from the collected tweets

{% highlight scala %}
import scala.annotation.tailrec

// create a list of edges from a single tweet's hashtags
def singleTweetEdges(tweet: List[String]): List[Edge] = {
    tweet match {
      case Nil => List()
      case List(x) => List()
      case x :: y :: ys => (List(Edge(Node(x, 1), Node(y, 1)).sorted) ::: singleTweetEdges(x :: ys) ::: singleTweetEdges(y :: ys)).distinct
    }
  }

// create a list of edges from a list of tweets 
def getEdgeList(tweetList: List[List[String]]): List[Edge] = {
    tweetList match {
      case Nil => List()
      case List() => List()
      case tweet :: ys => {
        ys match {
          case y :: ys1 => singleTweetEdges(tweet) ::: getEdgeList(ys)
          case Nil => singleTweetEdges(tweet)
        }
      }
    }
  }
  
def containsNode(list: List[Node], newNode: Node): Boolean =
    list.exists(node => node.label == newNode.label)

def containsEdge(list: List[WeightedEdge], newEdge: WeightedEdge): Boolean =
    list.exists(we => (we.source.label == newEdge.source.label)&&(we.target.label == newEdge.target.label))

def countEdges(list: List[Edge]): List[(Edge, Int)] = {
    list.map{case Edge(source, target) => (Edge(source, target).sorted, 1)}.groupBy(pair => pair._1).mapValues(_.length).toList
    }

def insertEdges(edges: List[Edge], acc: List[WeightedEdge]): List[WeightedEdge] = {
    edges match {
      case List() => acc
      case y :: ys => {
        val ySorted = y.sorted
        if (containsEdge(acc, WeightedEdge(ySorted.source, ySorted.target, 1))) {
          val inserted = for (we <- acc) yield {
            if (we == ySorted) WeightedEdge(ySorted.source, ySorted.target, 1 + we.weight)
            else we
        }
          insertEdges(ys, inserted)
        }
        else insertEdges(ys, acc ::: List(WeightedEdge(ySorted.source, ySorted.target, 1)))
      }
    }
    }

def updateWeightedEdges(tweet: TweetHashtags, acc: List[WeightedEdge]): List[WeightedEdge] = {
    val newEdges = singleTweetEdges(tweet)
    insertEdges(newEdges, acc)
    }

def updateNodesFromHashtag(ht: String, nodeList: List[Node]): List[Node] = {
    if (containsNode(nodeList, Node(ht, 1))) {
      for (node <- nodeList) yield {
        if (node.label == ht) Node(ht, 1 + node.weight)
        else node
      }
    }
    else nodeList ::: List(Node(ht, 1))
    }

def updateNodesFromTweet(tweet: TweetHashtags, acc: List[Node]): List[Node] =
    tweet match {
      case Nil => acc
      case y :: ys => updateNodesFromTweet(ys, updateNodesFromHashtag(y, acc))
    }

@tailrec
final def createHashtagNetAcc(tweetList: List[TweetHashtags], acc: (List[WeightedEdge], List[Node])): (List[WeightedEdge], List[Node]) =
    tweetList match {
      case Nil => acc
      case y :: ys => createHashtagNetAcc(ys, (updateWeightedEdges(y, acc._1), updateNodesFromTweet(y, acc._2)))
    }

def createHashtagNetwork(tweetList: List[TweetHashtags]): (List[WeightedEdge], List[Node]) =
    createHashtagNetAcc(tweetList, (List(), List()))
{% endhighlight %}

Then we can simply create the network with the following:

{% highlight scala %}
// read in the files I saved in parquet format
val data = spark.read.parquet("/path/to/parquet/files/*")

// convert the tweets to hashtag lists
val hashtagsByTweet = data.map((x: Row) => x.getString(5).split(" ").filter((str: String) => str.startsWith("#")).map((str: String) => str.toLowerCase.replaceAll("[^\\p{IsAlphabetic}^\\p{IsDigit}^@^#]", "")))

def listified = hashtagsByTweet.collect().map(x => x.toList).toList
// then create the network from the list of tweets
val (weightedEdges, weightedNodes) = createHashtagNetwork(listified)
{% endhighlight %}


## Results


<div id="mynetwork"></div>

Maybe write quick post on what a quantum dot is

<div id="hashtag_network"></div>
## What are phonons?

## Summary of paper


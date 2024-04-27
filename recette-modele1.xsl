<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:str="http://xsltsl.org/string" version="1.1">
  
<xsl:output method="html" indent="yes" />
<xsl:strip-space  elements="*"/>

<!-- Une seule recette  -->

<xsl:template match="/recette">
    <article class="recette-boite" id="REC-{@userid}">
        <h2 class="titre"><xsl:value-of select="nom"/></h2>
        <div class="photo">
            <xsl:choose>
                <xsl:when test="image"><img src="{image/@url}" alt="{nom}"/></xsl:when>
                <xsl:otherwise><img class="nophoto" src="icons/restaurant-plate-svgrepo-com.svg"/></xsl:otherwise>
            </xsl:choose>
        </div>
        <div class="description">
            <h3>Description</h3>
            <p><xsl:value-of select="description"/></p>
        </div>
        <div class="informations"> 
            <div>
                <h3>Categories</h3>
                <ul class="categories">
                    <xsl:for-each select="categorie">
                        <li><xsl:value-of select="."/></li>
                    </xsl:for-each>
                </ul>
            </div>

            <div>
                <h3>Sources</h3>
                <dl class="sources">
                    <dt>Auteur</dt><dd><xsl:value-of select="auteur"/></dd>
                    <dt>Licence</dt><dd><xsl:value-of select="licence"/></dd>
                    <dt>Source</dt><dd><a href="{source/@url}"><xsl:value-of select="source"/></a></dd>
                </dl>
            </div>

            <div>
                <h3>Informations</h3>
                <dl class="extra">
                    <xsl:for-each select="extra">
                        <dt><xsl:value-of select="nom"/></dt>
                        <dd><xsl:value-of select="val"/></dd>
                    </xsl:for-each>
                </dl>
            </div>
        </div>

        <!--                             -->
        <!-- par ingredients et etapes -->
        <!--                             -->
        <div class="partiesRegroupees">
            <h2>Ingrédients et étapes incluant les parties</h2>
            <!-- ingredients avec toutes les parties dedans -->
            <div class="ingredients">
                <h3>Ingrédients</h3>
                <xsl:for-each select="partie">
                    <xsl:if test="i">
                        <xsl:if test="nom">
                            <h3><xsl:value-of select="nom"/></h3>
                        </xsl:if>
                        <ul><xsl:apply-templates select="i"/></ul>
                    </xsl:if>
                </xsl:for-each>
            </div>

            <!-- etapes avec toutes les parties dedans -->
            <div class="etapes">
                <h3>Préparation</h3>
                <xsl:for-each select="partie">
                    <xsl:if test="e">
                        <xsl:if test="nom">
                            <h3><xsl:value-of select="nom"/></h3>
                        </xsl:if>
                        <ul>
                            <xsl:apply-templates select="e"/>
                        </ul>
                    </xsl:if>
                </xsl:for-each>
            </div>
        </div>

    </article>
</xsl:template>




<xsl:template match="z">
    <b style="background-color:red;"><xsl:value-of select="."/></b>
</xsl:template>

<xsl:template match="q">
    <span class="quantite">
        <xsl:if test="@sys">
            <xsl:attribute name="sys"><xsl:value-of select="@sys"/></xsl:attribute>
            <xsl:attribute name="u"><xsl:value-of select="@u"/></xsl:attribute>
        </xsl:if>
        <xsl:value-of select="."/>
        <xsl:text> </xsl:text>
        <xsl:value-of select="@u"/>
        <xsl:text> </xsl:text>
    </span>
</xsl:template>

<!--
        <xsl:for-each select="q">
            <span class="quantite {./@systeme}">
                <xsl:value-of select="."/> <xsl:value-of select="./@unite"/>
            </span>
        </xsl:for-each>
-->

<xsl:template match="i">
    <li><xsl:apply-templates select="text()|*"/></li>
</xsl:template>

<xsl:template match="e">
    <li><xsl:apply-templates select="text()|*"/></li>
</xsl:template>

<!-- indexes... on aide javascript -->
<xsl:template match="index">
    <span class="index"><xsl:value-of select="."/></span>
</xsl:template>


<!-- On ignore tout ce qui reste -->
<xsl:template match="*"></xsl:template>
  
</xsl:stylesheet>
